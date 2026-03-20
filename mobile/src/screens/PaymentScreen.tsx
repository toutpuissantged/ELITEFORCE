import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    SafeAreaView,
    ScrollView,
    Image,
    ActivityIndicator
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StackScreenProps } from '@react-navigation/stack';
import { MainStackParamList } from '../types/navigation';

type Props = StackScreenProps<MainStackParamList, 'Payment'>;

const METHODS = [
    { id: '1', title: 'Credit Card', icon: 'credit-card-outline', last4: '4242' },
    { id: '2', title: 'Apple Pay', icon: 'apple', last4: null },
    { id: '3', title: 'PayPal', icon: 'wallet-outline', last4: null },
];

import api from '../services/api';

const PaymentScreen: React.FC<Props> = ({ route, navigation }) => {
    const { amount, serviceName, bookingId } = route.params;
    const [selectedMethod, setSelectedMethod] = useState('1');
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        try {
            // In a real app, we would use Stripe SDK here.
            // For this test, we call the intent endpoint to simulate backend processing.
            await api.post('/payments/intent', { bookingId });

            navigation.navigate('Tracking', { bookingId });
        } catch (error: any) {
            console.error(error);
            alert(error.response?.data?.message || 'Payment failed');
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

                    {/* Payment Methods */}
                    <Text style={styles.sectionTitle}>Payment Method</Text>
                    {METHODS.map((method) => (
                        <TouchableOpacity
                            key={method.id}
                            style={[
                                styles.methodCard,
                                selectedMethod === method.id && styles.methodCardSelected
                            ]}
                            onPress={() => setSelectedMethod(method.id)}
                        >
                            <View style={[styles.methodIconContainer, { backgroundColor: selectedMethod === method.id ? theme.colors.primary : '#F3F4F6' }]}>
                                <MaterialCommunityIcons
                                    name={method.icon as any}
                                    size={24}
                                    color={selectedMethod === method.id ? '#fff' : theme.colors.text.secondary}
                                />
                            </View>
                            <View style={styles.methodInfo}>
                                <Text style={styles.methodTitle}>{method.title}</Text>
                                {method.last4 && <Text style={styles.methodSubtitle}>•••• •••• •••• {method.last4}</Text>}
                            </View>
                            <View style={[styles.radio, selectedMethod === method.id && styles.radioSelected]}>
                                {selectedMethod === method.id && <View style={styles.radioInner} />}
                            </View>
                        </TouchableOpacity>
                    ))}

                    <TouchableOpacity style={styles.addMethodBtn}>
                        <MaterialCommunityIcons name="plus" size={20} color={theme.colors.primary} />
                        <Text style={styles.addMethodText}>Add New Payment Method</Text>
                    </TouchableOpacity>
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
    methodCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    methodCardSelected: {
        borderColor: theme.colors.primary,
        backgroundColor: '#F0FDF4',
    },
    methodIconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
    },
    methodInfo: {
        flex: 1,
        marginLeft: 16,
    },
    methodTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: theme.colors.text.primary,
    },
    methodSubtitle: {
        fontSize: 12,
        color: theme.colors.text.muted,
        marginTop: 2,
    },
    radio: {
        width: 22,
        height: 22,
        borderRadius: 11,
        borderWidth: 2,
        borderColor: '#E5E7EB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    radioSelected: {
        borderColor: theme.colors.primary,
    },
    radioInner: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: theme.colors.primary,
    },
    addMethodBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        marginTop: 8,
    },
    addMethodText: {
        marginLeft: 8,
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.primary,
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
