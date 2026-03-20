import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';
import { theme } from '../theme';

type Props = StackScreenProps<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleReset = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setLoading(true);
        try {
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1500));
            Alert.alert(
                'Email Sent',
                'If an account exists with this email, you will receive reset instructions.',
                [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
            );
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <View style={styles.content}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <View style={styles.iconContainer}>
                            <MaterialCommunityIcons name="lock-reset" size={60} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.title}>Forgot Password</Text>
                        <Text style={styles.subtitle}>Enter your email address and we'll send you a link to reset your password.</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email Address</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="email-outline" size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="your@email.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholderTextColor={theme.colors.text.muted}
                                />
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.resetBtn, loading && styles.resetBtnDisabled]}
                            onPress={handleReset}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.resetBtnText}>Send reset link</Text>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}
                            style={styles.footer}
                        >
                            <Text style={styles.footerText}>Remember your password? </Text>
                            <Text style={styles.signInText}>Sign In</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    content: {
        flex: 1,
        paddingHorizontal: theme.spacing.lg,
    },
    backBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    header: {
        alignItems: 'flex-start',
        marginTop: 40,
        marginBottom: 40,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 12,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.text.muted,
        lineHeight: 24,
    },
    formContainer: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 32,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: theme.colors.text.primary,
        marginBottom: 8,
        marginLeft: 4,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 16,
        height: 60,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    resetBtn: {
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    resetBtnDisabled: {
        backgroundColor: theme.colors.text.muted,
    },
    resetBtnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '700',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    footerText: {
        color: theme.colors.text.muted,
        fontSize: 14,
    },
    signInText: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
});

export default ForgotPasswordScreen;
