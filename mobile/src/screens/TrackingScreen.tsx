import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSocket } from '../services/socketService';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';

type Props = StackScreenProps<MainStackParamList, 'Tracking'>;

export default function TrackingScreen({ route }: Props) {
    const { bookingId } = route.params;
    const { socket, joinBookingRoom } = useSocket();
    const [providerLocation, setProviderLocation] = useState<{ latitude: number, longitude: number } | null>(null);

    useEffect(() => {
        if (socket && bookingId) {
            joinBookingRoom(bookingId);

            const handleLocationUpdate = (location: { latitude: number, longitude: number }) => {
                setProviderLocation(location);
            };

            socket.on('provider-location', handleLocationUpdate);

            return () => {
                socket.off('provider-location', handleLocationUpdate);
            };
        }
    }, [socket, bookingId]);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Suivi de votre prestataire</Text>

            {providerLocation ? (
                <View style={styles.locationCard}>
                    <Text style={styles.label}>Position actuelle :</Text>
                    <Text style={styles.value}>Latitude: {providerLocation.latitude}</Text>
                    <Text style={styles.value}>Longitude: {providerLocation.longitude}</Text>
                    {/* Note: In a real app, react-native-maps would be used here to display a map marker */}
                    <View style={styles.mapPlaceholder}>
                        <Text style={styles.placeholderText}>[ CARTE EN TEMPS RÉEL ICI ]</Text>
                    </View>
                </View>
            ) : (
                <View style={styles.locationCard}>
                    <Text style={styles.waitingText}>En attente de la position du prestataire...</Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9', justifyContent: 'center' },
    title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
    locationCard: { backgroundColor: '#fff', padding: 20, borderRadius: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 3, elevation: 2, alignItems: 'center' },
    label: { fontSize: 16, color: '#666', marginBottom: 10 },
    value: { fontSize: 18, fontWeight: 'bold', color: '#2e64e5', marginBottom: 5 },
    mapPlaceholder: { width: '100%', height: 200, backgroundColor: '#e6eeff', marginTop: 20, justifyContent: 'center', alignItems: 'center', borderRadius: 8 },
    placeholderText: { color: '#2e64e5', fontWeight: 'bold' },
    waitingText: { fontSize: 16, color: '#888', fontStyle: 'italic' },
});
