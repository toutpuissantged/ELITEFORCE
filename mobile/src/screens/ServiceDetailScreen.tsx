import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Dimensions,
    ActivityIndicator,
    TextInput,
    Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { fetchServiceById } from '../store/servicesSlice';
import { createBooking } from '../store/bookingSlice';

type Props = StackScreenProps<MainStackParamList, 'ServiceDetail'>;

const { width } = Dimensions.get('window');

const ServiceDetailScreen: React.FC<Props> = ({ route, navigation }) => {
    const { serviceId } = route.params;
    const dispatch = useAppDispatch();
    const { list: services, loading: servicesLoading } = useAppSelector((state) => state.services);
    const service = services.find(s => s.id === serviceId);
    const { loading: bookingLoading } = useAppSelector((state) => state.bookings);

    const [address, setAddress] = useState('');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const [scheduledAt] = useState(tomorrow.toISOString());

    useEffect(() => {
        if (!service) {
            dispatch(fetchServiceById(serviceId));
        }
    }, [dispatch, serviceId, service]);

    const handleBooking = async () => {
        if (!address) {
            Alert.alert('Erreur', 'Veuillez saisir une adresse pour la prestation.');
            return;
        }

        const resultAction = await dispatch(createBooking({
            serviceId,
            scheduledAt,
            address,
        }));

        if (createBooking.fulfilled.match(resultAction)) {
            const newBooking = resultAction.payload;
            navigation.navigate('Payment', {
                bookingId: newBooking.id,
                amount: newBooking.totalPrice,
                serviceName: service?.name || 'Service'
            });
        } else {
            Alert.alert('Erreur', resultAction.payload as string || 'Erreur lors de la réservation');
        }
    };

    if (servicesLoading && !service) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!service) {
        return (
            <View style={styles.loaderContainer}>
                <Text>Service non trouvé</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Image Section */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: (service as any).image || 'https://images.unsplash.com/photo-1582910832782-d9055ee1722e?w=800&q=80' }}
                        style={styles.serviceImage}
                    />
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <View style={styles.content}>
                    <View style={styles.headerRow}>
                        <View>
                            <Text style={styles.serviceCategory}>{service.category}</Text>
                            <Text style={styles.serviceName}>{service.name}</Text>
                        </View>
                        <View style={styles.ratingBadge}>
                            <MaterialCommunityIcons name="star" size={18} color="#FFD700" />
                            <Text style={styles.ratingText}>{service.rating}</Text>
                        </View>
                    </View>

                    <View style={styles.infoGrid}>
                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="clock-outline" size={24} color={theme.colors.primary} />
                            <Text style={styles.infoLabel}>Durée</Text>
                            <Text style={styles.infoValue}>{service.duration} min</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="shield-check-outline" size={24} color={theme.colors.primary} />
                            <Text style={styles.infoLabel}>Sécurité</Text>
                            <Text style={styles.infoValue}>EliteForce</Text>
                        </View>
                        <View style={styles.infoItem}>
                            <MaterialCommunityIcons name="currency-usd" size={24} color={theme.colors.primary} />
                            <Text style={styles.infoLabel}>Prix</Text>
                            <Text style={styles.infoValue}>{service.basePrice} Dhs</Text>
                        </View>
                    </View>

                    <Text style={styles.sectionTitle}>À propos du service</Text>
                    <Text style={styles.description}>
                        {service.description} EliteForce garantit une protection de haut niveau avec des agents certifiés et expérimentés. Notre mission est d'assurer votre sécurité et votre tranquillité d'esprit en toutes circonstances.
                    </Text>

                    <Text style={styles.sectionTitle}>Adresse d'intervention</Text>
                    <TextInput
                        style={styles.addressInput}
                        placeholder="Saisissez l'adresse de l'intervention..."
                        placeholderTextColor={theme.colors.text.muted}
                        value={address}
                        onChangeText={setAddress}
                        multiline
                    />

                    <Text style={styles.sectionTitle}>Date prévue</Text>
                    <View style={styles.dateBox}>
                        <MaterialCommunityIcons name="calendar-clock" size={24} color={theme.colors.primary} />
                        <Text style={styles.dateText}>{new Date(scheduledAt).toLocaleString()}</Text>
                    </View>

                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalLabel}>Prix Total</Text>
                    <Text style={styles.totalPrice}>{service.basePrice} Dhs</Text>
                </View>
                <TouchableOpacity
                    style={[styles.bookBtn, bookingLoading && styles.btnDisabled]}
                    onPress={handleBooking}
                    disabled={bookingLoading}
                >
                    {bookingLoading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.bookBtnText}>Réserver</Text>
                    )}
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageContainer: {
        width: '100%',
        height: 350,
        backgroundColor: '#f5f5f5',
    },
    serviceImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    backBtn: {
        position: 'absolute',
        top: 20,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    content: {
        padding: 24,
        borderTopLeftRadius: 40,
        borderTopRightRadius: 40,
        marginTop: -40,
        backgroundColor: '#fff',
        flex: 1,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    serviceCategory: {
        fontSize: 14,
        color: theme.colors.primary,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    serviceName: {
        fontSize: 24,
        fontWeight: '800',
        color: '#222',
    },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFBEB',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
    },
    ratingText: {
        marginLeft: 4,
        fontWeight: '700',
        color: '#D97706',
    },
    infoGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
        backgroundColor: '#F9FAFB',
        padding: 20,
        borderRadius: 24,
    },
    infoItem: {
        alignItems: 'center',
        flex: 1,
    },
    infoLabel: {
        fontSize: 12,
        color: '#888',
        marginTop: 8,
        marginBottom: 2,
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '700',
        color: '#222',
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#222',
        marginBottom: 12,
        marginTop: 8,
    },
    description: {
        fontSize: 15,
        color: '#666',
        lineHeight: 24,
        marginBottom: 24,
    },
    addressInput: {
        backgroundColor: '#F9FAFB',
        borderRadius: 16,
        padding: 16,
        height: 100,
        textAlignVertical: 'top',
        fontSize: 15,
        color: '#222',
        borderWidth: 1,
        borderColor: '#F3F4F6',
        marginBottom: 24,
    },
    dateBox: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F9FAFB',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#F3F4F6',
    },
    dateText: {
        marginLeft: 12,
        fontSize: 15,
        color: '#222',
        fontWeight: '600',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 24,
        paddingBottom: 34,
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    priceContainer: {
        flex: 1,
    },
    totalLabel: {
        fontSize: 14,
        color: '#888',
        marginBottom: 2,
    },
    totalPrice: {
        fontSize: 20,
        fontWeight: '800',
        color: theme.colors.primary,
    },
    bookBtn: {
        backgroundColor: theme.colors.primary,
        paddingHorizontal: 32,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1.2,
    },
    btnDisabled: {
        opacity: 0.7,
    },
    bookBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default ServiceDetailScreen;
