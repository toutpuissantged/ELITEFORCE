import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from 'react-native';
import { useAppSelector } from '../hooks/store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useSocket } from '../services/socketService';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabParamList, MainStackParamList } from '../types/navigation';
import { Booking } from '../types';
import axios from 'axios';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, 'Bookings'>,
    StackScreenProps<MainStackParamList>
>;

export default function BookingsScreen({ navigation }: Props) {
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { token } = useAppSelector((state) => state.auth);
    const { socket, joinBookingRoom } = useSocket();
    const API_URL = process.env.API_URL || 'http://localhost:3000';

    const fetchBookings = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/bookings/me`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBookings(response.data);
            setError(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    useEffect(() => {
        if (socket && bookings.length > 0) {
            bookings.forEach(booking => {
                if (booking.status === 'PENDING' || booking.status === 'CONFIRMED' || booking.status === 'IN_PROGRESS') {
                    joinBookingRoom(booking.id);
                }
            });

            const handleStatusUpdate = (data: { bookingId: number, status: Booking['status'] }) => {
                const { bookingId, status } = data;
                setBookings(prevBookings => prevBookings.map(b =>
                    b.id === bookingId ? { ...b, status } : b
                ));
            };

            const handleLocationUpdate = (location: { latitude: number, longitude: number }) => {
                // Here we could update a map or show an indicator
                console.log(`Provider is at Lat: ${location.latitude}, Lng: ${location.longitude}`);
            };

            socket.on('booking-status-update', handleStatusUpdate);
            socket.on('provider-location', handleLocationUpdate);

            return () => {
                socket.off('booking-status-update', handleStatusUpdate);
                socket.off('provider-location', handleLocationUpdate);
            };
        }
    }, [socket, bookings]);

    const onRefresh = useCallback(() => {
        setRefreshing(true);
        fetchBookings();
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return '#FFA500'; // Orange
            case 'CONFIRMED': return '#2e64e5'; // Blue
            case 'IN_PROGRESS': return '#8A2BE2'; // Purple
            case 'COMPLETED': return '#32CD32'; // Green
            case 'CANCELLED': return '#FF0000'; // Red
            default: return '#888';
        }
    };

    const renderBookingItem = ({ item }: { item: Booking }) => (
        <View style={styles.bookingCard}>
            <View style={styles.headerRow}>
                <Text style={styles.serviceName}>{item.service?.name}</Text>
                <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                    {item.status}
                </Text>
            </View>

            <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar" size={16} color="#666" />
                <Text style={styles.detailText}>
                    {new Date(item.scheduledAt).toLocaleDateString()} à {new Date(item.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
            </View>

            <View style={styles.detailRow}>
                <MaterialCommunityIcons name="map-marker" size={16} color="#666" />
                <Text style={styles.detailText}>{item.address}</Text>
            </View>

            <View style={styles.footerRow}>
                <Text style={styles.priceText}>{item.totalPrice} Dhs</Text>
                {item.status === 'PENDING' && (
                    <TouchableOpacity
                        style={styles.payButton}
                        onPress={() => navigation.navigate('Payment', {
                            bookingId: item.id,
                            amount: item.totalPrice,
                            serviceName: item.service?.name || ''
                        })}
                    >
                        <Text style={styles.payButtonText}>Payer</Text>
                    </TouchableOpacity>
                )}
                {item.status === 'IN_PROGRESS' && (
                    <TouchableOpacity
                        style={styles.trackButton}
                        onPress={() => navigation.navigate('Tracking', { bookingId: item.id })}
                    >
                        <Text style={styles.payButtonText}>Suivre</Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mes Réservations</Text>

            {error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : loading && !refreshing ? (
                <ActivityIndicator size="large" color="#2e64e5" style={styles.loader} />
            ) : bookings.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <MaterialCommunityIcons name="calendar-blank" size={64} color="#ccc" />
                    <Text style={styles.emptyText}>Aucune réservation trouvée</Text>
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    renderItem={renderBookingItem}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContainer}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f9f9f9', paddingTop: 60 },
    title: { fontSize: 24, fontWeight: 'bold', color: '#333', paddingHorizontal: 20, marginBottom: 15 },
    loader: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    listContainer: { padding: 20 },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
    serviceName: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    statusText: { fontSize: 14, fontWeight: 'bold' },
    detailRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
    detailText: { fontSize: 14, color: '#666', marginLeft: 8 },
    footerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, borderTopWidth: 1, borderTopColor: '#eee', paddingTop: 10 },
    priceText: { fontSize: 16, fontWeight: 'bold', color: '#2e64e5' },
    payButton: { backgroundColor: '#2e64e5', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
    payButtonText: { color: '#fff', fontWeight: 'bold' },
    trackButton: { backgroundColor: '#8A2BE2', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 8 },
    emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { marginTop: 10, fontSize: 16, color: '#888' },
    errorText: { textAlign: 'center', marginTop: 20, color: 'red', fontSize: 16 },
});
