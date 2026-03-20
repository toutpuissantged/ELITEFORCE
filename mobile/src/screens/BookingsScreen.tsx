import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ActivityIndicator,
    RefreshControl,
    Dimensions
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabParamList, MainStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { fetchMyBookings } from '../store/bookingSlice';
import { BookingStatus } from '../types';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, 'Bookings'>,
    StackScreenProps<MainStackParamList>
>;

const { width } = Dimensions.get('window');

const BookingsScreen: React.FC<Props> = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const { list: bookings, loading } = useAppSelector((state) => state.bookings);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        dispatch(fetchMyBookings());
    }, [dispatch]);

    const onRefresh = async () => {
        setRefreshing(true);
        await dispatch(fetchMyBookings());
        setRefreshing(false);
    };

    const getStatusStyle = (status: BookingStatus) => {
        switch (status) {
            case BookingStatus.IN_PROGRESS: return { bg: '#E0F2FE', text: '#0369A1', label: 'En Cours' };
            case BookingStatus.COMPLETED: return { bg: '#F0FDF4', text: '#15803D', label: 'Terminé' };
            case BookingStatus.CANCELLED: return { bg: '#FEF2F2', text: '#B91C1C', label: 'Annulé' };
            case BookingStatus.CONFIRMED: return { bg: '#F5F3FF', text: '#6D28D9', label: 'Confirmé' };
            default: return { bg: '#F3F4F6', text: '#4B5563', label: 'En Attente' };
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const statusStyle = getStatusStyle(item.status);
        const canTrack = [BookingStatus.IN_PROGRESS, BookingStatus.CONFIRMED].includes(item.status);

        return (
            <TouchableOpacity 
                style={styles.card}
                onPress={() => canTrack && navigation.navigate('Tracking', { bookingId: item.id })}
                activeOpacity={0.7}
            >
                <View style={styles.cardHeader}>
                    <View style={styles.serviceInfo}>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: item.service?.image || 'https://images.unsplash.com/photo-1544022485-6bb04439c73d?w=200&q=80' }}
                                style={styles.serviceImage}
                            />
                        </View>
                        <View style={styles.textContainer}>
                            <Text style={styles.categoryName}>{item.service?.category || 'Service'}</Text>
                            <Text style={styles.serviceName} numberOfLines={1}>{item.service?.name || 'Unnamed Service'}</Text>
                        </View>
                    </View>
                    <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                        <Text style={[styles.statusText, { color: statusStyle.text }]}>{statusStyle.label}</Text>
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.cardDetails}>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="calendar-outline" size={16} color="#888" />
                        <Text style={styles.detailText}>
                            {new Date(item.scheduledAt).toLocaleDateString('fr-FR')}
                        </Text>
                    </View>
                    <View style={styles.detailItem}>
                        <MaterialCommunityIcons name="clock-outline" size={16} color="#888" />
                        <Text style={styles.detailText}>
                            {new Date(item.scheduledAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                    </View>
                </View>

                <View style={styles.cardFooter}>
                    <View style={styles.priceSection}>
                        <Text style={styles.priceLabel}>Prix Payé</Text>
                        <Text style={styles.priceValue}>{item.totalPrice} Dhs</Text>
                    </View>
                    {canTrack && (
                        <TouchableOpacity 
                            style={styles.trackBtn}
                            onPress={() => navigation.navigate('Tracking', { bookingId: item.id })}
                        >
                            <Text style={styles.trackBtnText}>Suivre</Text>
                            <MaterialCommunityIcons name="chevron-right" size={18} color="#fff" />
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Mes Réservations</Text>
            </View>

            {loading && !refreshing && bookings.length === 0 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={bookings}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[theme.colors.primary]} />
                    }
                    renderItem={renderItem}
                    ListEmptyComponent={() => (
                        <View style={styles.emptyContainer}>
                            <View style={styles.emptyIconBg}>
                                <MaterialCommunityIcons name="calendar-blank-outline" size={60} color="#CBD5E1" />
                            </View>
                            <Text style={styles.emptyTitle}>Aucune réservation</Text>
                            <Text style={styles.emptyDesc}>Vous n'avez pas encore effectué de réservation de services EliteForce.</Text>
                            <TouchableOpacity 
                                style={styles.bookNowBtn}
                                onPress={() => navigation.navigate('Home')}
                            >
                                <Text style={styles.bookNowText}>Découvrir nos services</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FB',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 16,
        paddingBottom: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '800',
        color: '#1E293B',
    },
    listContent: {
        padding: 24,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 10,
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F1F5F9',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    serviceInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    imageContainer: {
        width: 50,
        height: 50,
        borderRadius: 15,
        overflow: 'hidden',
        backgroundColor: '#F1F5F9',
    },
    serviceImage: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        marginLeft: 14,
        flex: 1,
    },
    categoryName: {
        fontSize: 10,
        fontWeight: '700',
        color: theme.colors.primary,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#1E293B',
        marginTop: 2,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 10,
        marginLeft: 10,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#F1F5F9',
        marginVertical: 16,
    },
    cardDetails: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 24,
    },
    detailText: {
        fontSize: 13,
        color: '#64748B',
        marginLeft: 6,
        fontWeight: '500',
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#F8FAFC',
        padding: 12,
        borderRadius: 16,
    },
    priceSection: {
        flex: 1,
    },
    priceLabel: {
        fontSize: 10,
        color: '#94A3B8',
        fontWeight: '600',
    },
    priceValue: {
        fontSize: 16,
        fontWeight: '800',
        color: '#1E293B',
    },
    trackBtn: {
        backgroundColor: theme.colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 12,
    },
    trackBtnText: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '700',
        marginRight: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 80,
        paddingHorizontal: 40,
    },
    emptyIconBg: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#F1F5F9',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B',
        marginBottom: 8,
    },
    emptyDesc: {
        fontSize: 14,
        color: '#64748B',
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 32,
    },
    bookNowBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 14,
        borderRadius: 16,
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 4,
    },
    bookNowText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '700',
    },
});

export default BookingsScreen;
