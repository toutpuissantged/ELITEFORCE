import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    SafeAreaView,
    Image
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { StackScreenProps } from '@react-navigation/stack';
import { BottomTabParamList, MainStackParamList } from '../types/navigation';

type Props = CompositeScreenProps<
    BottomTabScreenProps<BottomTabParamList, 'Home'>,
    StackScreenProps<MainStackParamList>
>;

const BOOKINGS = [
    {
        id: '1',
        service: 'Grocery Delivery',
        date: 'Oct 24, 2023',
        time: '10:30 AM',
        status: 'In Progress',
        price: '45.00',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&q=80',
    },
    {
        id: '2',
        service: 'Pharmacy Pick-up',
        date: 'Oct 22, 2023',
        time: '02:15 PM',
        status: 'Completed',
        price: '12.50',
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbbb88?w=400&q=80',
    },
];

const BookingsScreen: React.FC<Props> = ({ navigation }) => {
    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'In Progress': return { bg: '#E0F2FE', text: '#0369A1' };
            case 'Completed': return { bg: '#F0FDF4', text: '#15803D' };
            case 'Cancelled': return { bg: '#FEF2F2', text: '#B91C1C' };
            default: return { bg: '#F3F4F6', text: '#4B5563' };
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Bookings</Text>
            </View>

            <FlatList
                data={BOOKINGS}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                    const statusStyle = getStatusStyle(item.status);
                    return (
                        <TouchableOpacity
                            style={styles.bookingCard}
                            onPress={() => item.status === 'In Progress' && navigation.navigate('Tracking', { bookingId: parseInt(item.id) })}
                        >
                            <View style={styles.cardHeader}>
                                <Image source={{ uri: item.image }} style={styles.serviceImage} />
                                <View style={styles.mainInfo}>
                                    <Text style={styles.serviceName}>{item.service}</Text>
                                    <View style={styles.dateTimeRow}>
                                        <MaterialCommunityIcons name="calendar-outline" size={14} color={theme.colors.text.muted} />
                                        <Text style={styles.dateTimeText}>{item.date} • {item.time}</Text>
                                    </View>
                                </View>
                                <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
                                    <Text style={[styles.statusText, { color: statusStyle.text }]}>{item.status}</Text>
                                </View>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.cardFooter}>
                                <View style={styles.priceContainer}>
                                    <Text style={styles.priceLabel}>Total Price</Text>
                                    <Text style={styles.priceValue}>$ {item.price}</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.detailsBtn}
                                    onPress={() => { }}
                                >
                                    <Text style={styles.detailsBtnText}>View Details</Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    );
                }}
                ListEmptyComponent={() => (
                    <View style={styles.emptyContainer}>
                        <MaterialCommunityIcons name="calendar-blank" size={60} color={theme.colors.text.muted} />
                        <Text style={styles.emptyText}>No bookings yet</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        padding: theme.spacing.lg,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    listContent: {
        padding: theme.spacing.lg,
    },
    bookingCard: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.xl,
        marginBottom: 16,
        padding: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    serviceImage: {
        width: 60,
        height: 60,
        borderRadius: 15,
        backgroundColor: '#F3F4F6',
    },
    mainInfo: {
        flex: 1,
        marginLeft: 16,
    },
    serviceName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 4,
    },
    dateTimeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dateTimeText: {
        fontSize: 12,
        color: theme.colors.text.muted,
        marginLeft: 4,
    },
    statusBadge: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    statusText: {
        fontSize: 10,
        fontWeight: '700',
    },
    divider: {
        height: 1,
        backgroundColor: '#FAFAFA',
        marginVertical: 16,
    },
    cardFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    priceContainer: {
        justifyContent: 'center',
    },
    priceLabel: {
        fontSize: 10,
        color: theme.colors.text.muted,
        marginBottom: 2,
    },
    priceValue: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    detailsBtn: {
        backgroundColor: '#F9FAFB',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    detailsBtnText: {
        fontSize: 12,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        fontSize: 16,
        color: theme.colors.text.muted,
        marginTop: 16,
    },
});

export default BookingsScreen;
