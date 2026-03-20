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
    Platform,
    ScrollView
} from 'react-native';
import { setUser, setToken, setLoading, setError } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';
import { theme } from '../theme';
import axios from 'axios';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const API_URL = process.env.API_URL || 'http://localhost:3000';

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        dispatch(setLoading(true));
        dispatch(setError(null));

        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                email,
                password,
            });

            const { user, token } = response.data;

            await AsyncStorage.setItem('token', token);
            dispatch(setToken(token));
            dispatch(setUser(user));
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Invalid credentials';
            dispatch(setError(errorMsg));
            Alert.alert('Error', errorMsg);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <MaterialCommunityIcons name="shield-check" size={60} color={theme.colors.primary} />
                        </View>
                        <Text style={styles.title}>Welcome Back</Text>
                        <Text style={styles.subtitle}>Sign in to continue to ELITEFORCE</Text>
                    </View>

                    <View style={styles.form}>
                        {error && (
                            <View style={styles.errorBanner}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.error} />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        )}

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

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.inputWrapper}>
                                <MaterialCommunityIcons name="lock-outline" size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="••••••••"
                                    secureTextEntry={!showPassword}
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholderTextColor={theme.colors.text.muted}
                                />
                                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                                    <MaterialCommunityIcons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={theme.colors.text.muted} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('ForgotPassword')}
                            style={styles.forgotBtn}
                        >
                            <Text style={styles.forgotText}>Forgot Password?</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
                            onPress={handleLogin}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.loginBtnText}>Sign In</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                                <Text style={styles.signUpText}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: theme.colors.background,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: theme.spacing.lg,
        paddingBottom: theme.spacing.xl,
    },
    header: {
        alignItems: 'center',
        marginTop: 60,
        marginBottom: 40,
    },
    logoContainer: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: theme.colors.text.primary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: theme.colors.text.muted,
        textAlign: 'center',
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: theme.borderRadius.xl,
        padding: theme.spacing.lg,
        borderWidth: 1,
        borderColor: theme.colors.border,
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 14,
        marginLeft: 8,
        fontWeight: '500',
    },
    inputContainer: {
        marginBottom: 20,
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
        backgroundColor: '#FAFAFA',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        paddingHorizontal: 16,
        height: 56,
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: theme.colors.text.primary,
    },
    eyeBtn: {
        padding: 5,
    },
    forgotBtn: {
        alignSelf: 'flex-end',
        marginBottom: 24,
    },
    forgotText: {
        color: theme.colors.primary,
        fontWeight: '600',
        fontSize: 14,
    },
    loginBtn: {
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginBtnDisabled: {
        backgroundColor: theme.colors.text.muted,
    },
    loginBtnText: {
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
    signUpText: {
        color: theme.colors.primary,
        fontWeight: '700',
        fontSize: 14,
    },
});

export default LoginScreen;
