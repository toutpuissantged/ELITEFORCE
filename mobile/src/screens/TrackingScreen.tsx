import React, { useEffect, useState, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    Image,
    ScrollView,
    Alert,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import io from 'socket.io-client';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { fetchBookingById } from '../store/bookingSlice';
import { BookingStatus } from '../types';
import { SOCKET_URL } from '../config';

type Props = StackScreenProps<MainStackParamList, 'Tracking'>;

const INITIAL_STEPS = [
    { id: '1', title: 'Order Confirmed', time: '--:--', completed: false },
    { id: '2', title: 'Preparing Order', time: '--:--', completed: false },
    { id: '3', title: 'Provider is on the way', time: '--:--', completed: false, active: false },
    { id: '4', title: 'Delivered / Completed', time: '--:--', completed: false },
];

const { width } = Dimensions.get('window');

const TrackingScreen: React.FC<Props> = ({ navigation, route }) => {
    const dispatch = useAppDispatch();
    const { bookingId } = route.params;
    const { list: bookings, loading } = useAppSelector(state => state.bookings);
    const booking = bookings.find(b => b.id === bookingId);

    const { token } = useAppSelector(state => state.auth);
    const [location, setLocation] = useState({ latitude: 33.5731, longitude: -7.5898 }); // Default to Casablanca HQ
    const [steps, setSteps] = useState(INITIAL_STEPS);

    const updateTimeline = useCallback((newStatus: BookingStatus) => {
        setSteps(prevSteps => prevSteps.map(step => {
            if ([BookingStatus.CONFIRMED, BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED].includes(newStatus) && step.id === '1')
                return { ...step, completed: true };
            if ([BookingStatus.IN_PROGRESS, BookingStatus.COMPLETED].includes(newStatus) && step.id === '2')
                return { ...step, completed: true };
            if (newStatus === BookingStatus.IN_PROGRESS && step.id === '3')
                return { ...step, active: true, completed: false };
            if (newStatus === BookingStatus.COMPLETED)
                return { ...step, completed: true, active: false };
            return step;
        }));
    }, []);

    useEffect(() => {
        dispatch(fetchBookingById(bookingId));
    }, [dispatch, bookingId]);

    useEffect(() => {
        if (booking) {
            updateTimeline(booking.status);
        }
    }, [booking, updateTimeline]);

    useEffect(() => {
        if (!token) return;

        const socket = io(SOCKET_URL, {
            auth: { token }
        });

        socket.on('connect', () => {
            socket.emit('join-booking-room', bookingId.toString());
        });

        socket.on('provider-location', (coords: { latitude: number, longitude: number }) => {
            setLocation(coords);
        });

        socket.on('booking-status-update', (data: { status: BookingStatus }) => {
            updateTimeline(data.status);
        });

        socket.on('mission-completed', () => {
            Alert.alert('Success', 'Your service has been completed!');
            navigation.navigate('BottomTabs', { screen: 'Bookings' } as any);
        });

        return () => {
            socket.disconnect();
        };
    }, [bookingId, token, updateTimeline]);

    if (loading && !booking) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Track Order</Text>
                <TouchableOpacity style={styles.helpBtn}>
                    <MaterialCommunityIcons name="help-circle-outline" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Map View */}
                <View style={styles.mapPlaceholder}>
                    <MapView
                        provider={PROVIDER_GOOGLE}
                        style={styles.mapImage}
                        region={{
                            latitude: location.latitude,
                            longitude: location.longitude,
                            latitudeDelta: 0.05,
                            longitudeDelta: 0.05,
                        }}
                    >
                        <Marker coordinate={location}>
                            <View style={styles.providerMarker}>
                                <MaterialCommunityIcons name="truck-delivery" size={24} color="#fff" />
                            </View>
                        </Marker>
                    </MapView>
                </View>

                {/* Tracking Content */}
                <View style={styles.content}>
                    <View style={styles.providerCard}>
                        <Image
                            source={{ uri: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=400&q=80' }}
                            style={styles.providerImage}
                        />
                        <View style={styles.providerInfo}>
                            <Text style={styles.providerName}>{booking?.provider?.firstName || 'John'} {booking?.provider?.lastName || 'Doe'}</Text>
                            <Text style={styles.providerRole}>Partner Elite Force</Text>
                        </View>
                        <View style={styles.actionBtns}>
                            <TouchableOpacity style={styles.actionBtn}>
                                <MaterialCommunityIcons name="phone-outline" size={20} color={theme.colors.primary} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>Order Status: {booking?.status || 'PENDING'}</Text>
                    <View style={styles.timeline}>
                        {steps.map((step, index) => (
                            <View key={step.id} style={styles.stepContainer}>
                                <View style={styles.indicatorContainer}>
                                    <View style={[
                                        styles.dot,
                                        step.completed && styles.dotCompleted,
                                        step.active && styles.dotActive
                                    ]}>
                                        {step.completed && <MaterialCommunityIcons name="check" size={12} color="#fff" />}
                                    </View>
                                    {index < steps.length - 1 && (
                                        <View style={[
                                            styles.line,
                                            step.completed && styles.lineCompleted
                                        ]} />
                                    )}
                                </View>
                                <View style={styles.stepInfo}>
                                    <Text style={[
                                        styles.stepTitle,
                                        step.active && styles.stepTitleActive
                                    ]}>{step.title}</Text>
                                    <Text style={styles.stepTime}>{step.time}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.lg,
        paddingTop: theme.spacing.md,
        paddingBottom: theme.spacing.md,
        backgroundColor: '#fff',
    },
    backBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    helpBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    mapPlaceholder: {
        height: 300,
        width: '100%',
        backgroundColor: '#FAFAFA',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },
    mapImage: {
        width: '100%',
        height: '100%',
        opacity: 0.6,
    },
    providerMarker: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: theme.colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#fff',
    },
    content: {
        padding: theme.spacing.lg,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        backgroundColor: '#fff',
        marginTop: -32,
        minHeight: 400,
    },
    providerCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        borderRadius: 24,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    providerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    providerInfo: {
        flex: 1,
        marginLeft: 16,
    },
    providerName: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    providerRole: {
        fontSize: 12,
        color: theme.colors.text.muted,
        marginTop: 2,
    },
    actionBtns: {
        flexDirection: 'row',
    },
    actionBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 24,
    },
    timeline: {
        paddingLeft: 8,
    },
    stepContainer: {
        flexDirection: 'row',
        height: 80,
    },
    indicatorContainer: {
        alignItems: 'center',
        width: 30,
    },
    dot: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
    },
    dotCompleted: {
        backgroundColor: theme.colors.success,
    },
    dotActive: {
        backgroundColor: theme.colors.primary,
        borderWidth: 4,
        borderColor: '#E0F2FE',
    },
    line: {
        width: 2,
        flex: 1,
        backgroundColor: '#E5E7EB',
        marginVertical: 4,
    },
    lineCompleted: {
        backgroundColor: theme.colors.success,
    },
    stepInfo: {
        flex: 1,
        marginLeft: 16,
        paddingTop: 0,
    },
    stepTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: theme.colors.text.muted,
    },
    stepTitleActive: {
        color: theme.colors.text.primary,
        fontWeight: '700',
    },
    stepTime: {
        fontSize: 12,
        color: theme.colors.text.muted,
        marginTop: 4,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
});

export default TrackingScreen;
