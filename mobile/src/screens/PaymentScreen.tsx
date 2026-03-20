import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    ActivityIndicator,
    Alert
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';
import { useStripe, CardField } from '@stripe/stripe-react-native';

type Props = StackScreenProps<MainStackParamList, 'Payment'>;

const METHODS = [
    { id: '1', title: 'Credit Card', icon: 'credit-card-outline', last4: '4242' },
    { id: '2', title: 'Apple Pay', icon: 'apple', last4: null },
    { id: '3', title: 'PayPal', icon: 'wallet-outline', last4: null },
];

import api from '../services/api';

const PaymentScreen: React.FC<Props> = ({ route, navigation }) => {
    const { amount, serviceName, bookingId } = route.params;
    const [loading, setLoading] = useState(false);
    const { confirmPayment } = useStripe();
    const [cardDetails, setCardDetails] = useState<any>(null);

    const handlePayment = async () => {
        if (!cardDetails?.complete) {
            Alert.alert('Erreur', 'Veuillez saisir les détails complets de la carte');
            return;
        }

        setLoading(true);
        try {
            // 1. Get intent from backend
            const response = await api.post('/payments/intent', { bookingId });
            const { clientSecret } = response.data;

            // 2. Confirm payment
            const { error, paymentIntent } = await confirmPayment(clientSecret, {
                paymentMethodType: 'Card',
            });

            if (error) {
                Alert.alert('Paiement échoué', error.message);
            } else if (paymentIntent) {
                // Payment was successful!
                navigation.navigate('Tracking', { bookingId });
            }
        } catch (error: any) {
            console.error(error);
            Alert.alert('Erreur', error.response?.data?.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text.primary} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Checkout</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Order Summary */}
                    <View style={styles.summaryCard}>
                        <Text style={styles.sectionTitle}>Order Summary</Text>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>{serviceName}</Text>
                            <Text style={styles.summaryValue}>$ {amount.toFixed(2)}</Text>
                        </View>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Delivery Fee</Text>
                            <Text style={styles.summaryValue}>$ 5.00</Text>
                        </View>
                        <View style={styles.divider} />
                        <View style={styles.totalRow}>
                            <Text style={styles.totalLabel}>Total Amount</Text>
                            <Text style={styles.totalValue}>$ {(amount + 5).toFixed(2)}</Text>
                        </View>
                    </View>

                    {/* Stripe Card Field */}
                    <View style={styles.stripeContainer}>
                        <View style={styles.secureBadge}>
                            <MaterialCommunityIcons name="lock-check" size={16} color={theme.colors.success} />
                            <Text style={styles.secureText}>Paiement sécurisé par Stripe</Text>
                        </View>
                        <CardField
                            postalCodeEnabled={false}
                            onCardChange={(cardDetails) => {
                                setCardDetails(cardDetails);
                            }}
                            style={styles.cardField}
                            cardStyle={{
                                backgroundColor: '#FAFAFA',
                                textColor: '#000000',
                                borderRadius: 12,
                            }}
                        />
                    </View>
                </View>

                <View style={{ height: 120 }} />
            </ScrollView>

            {/* Footer */}
            <View style={styles.footer}>
                <View style={styles.footerInfo}>
                    <Text style={styles.footerLabel}>Total Payment</Text>
                    <Text style={styles.footerValue}>$ {(amount + 5).toFixed(2)}</Text>
                </View>
                <TouchableOpacity
                    style={[styles.payBtn, loading && styles.payBtnDisabled]}
                    onPress={handlePayment}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#fff" />
                    ) : (
                        <Text style={styles.payBtnText}>Pay Now</Text>
                    )}
                </TouchableOpacity>
            </View>
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
    content: {
        padding: theme.spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 16,
        marginTop: 8,
    },
    summaryCard: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.xl,
        padding: 20,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    summaryRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    summaryLabel: {
        fontSize: 14,
        color: theme.colors.text.secondary,
    },
    summaryValue: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.primary,
    },
    divider: {
        height: 1,
        backgroundColor: '#F3F4F6',
        marginVertical: 16,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    totalValue: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.primary,
    },
    stripeContainer: {
        marginTop: 16,
        padding: 16,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    secureBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
        backgroundColor: '#F0FDF4',
        paddingVertical: 8,
        borderRadius: 8,
    },
    secureText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.success,
    },
    cardField: {
        width: '100%',
        height: 50,
        marginVertical: 10,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: theme.spacing.lg,
        paddingBottom: 34,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: '#F3F4F6',
    },
    footerInfo: {
        justifyContent: 'center',
    },
    footerLabel: {
        fontSize: 12,
        color: theme.colors.text.muted,
        marginBottom: 2,
    },
    footerValue: {
        fontSize: 20,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    payBtn: {
        backgroundColor: theme.colors.primary,
        height: 56,
        paddingHorizontal: 40,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    payBtnDisabled: {
        backgroundColor: theme.colors.text.muted,
    },
    payBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '700',
    },
});

export default PaymentScreen;
