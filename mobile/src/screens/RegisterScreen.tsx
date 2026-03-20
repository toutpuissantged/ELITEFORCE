import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    Alert,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    StyleSheet as RNStyleSheet
} from 'react-native';
import PhoneInputField from '../components/PhoneInputField';
import { register, clearError } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';
import { theme } from '../theme';

type Props = StackScreenProps<AuthStackParamList, 'Register'>;

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
    });
    const [formattedPhone, setFormattedPhone] = useState('');
    const [agreeCGU, setAgreeCGU] = useState(false);
    const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const validateField = (name: string, value: string) => {
        let error = '';
        switch (name) {
            case 'firstName':
                if (!value) error = 'First name required';
                break;
            case 'lastName':
                if (!value) error = 'Last name required';
                break;
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) error = 'Invalid email address';
                break;
            case 'phone':
                if (!value) error = 'Phone number required';
                break;
            case 'password':
                if (!value) error = 'Password required';
                break;
            case 'confirmPassword':
                if (value !== formData.password) error = 'Passwords do not match';
                break;
        }
        setValidationErrors(prev => ({ ...prev, [name]: error }));
        return !error;
    };

    const validate = () => {
        const fields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword'];
        let isValid = true;
        fields.forEach(field => {
            if (!validateField(field, (formData as any)[field])) {
                isValid = false;
            }
        });

        if (!agreeCGU) {
            setValidationErrors(prev => ({ ...prev, cgu: 'You must accept the terms' }));
            isValid = false;
        }

        return isValid;
    };

    const handleRegister = async () => {
        if (!validate()) return;

        const resultAction = await dispatch(register({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formattedPhone || formData.phone,
            password: formData.password,
            confirmPassword: formData.confirmPassword,
            acceptTerms: agreeCGU,
        }));

        if (register.rejected.match(resultAction)) {
            Alert.alert('Error', resultAction.payload as string || 'Registration failed');
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
        if (name !== 'phone') {
            validateField(name, value);
        }
    };

    const renderInput = (
        name: keyof typeof formData,
        placeholder: string,
        icon: keyof typeof MaterialCommunityIcons.glyphMap,
        keyboardType: any = 'default',
        secureTextEntry: boolean = false
    ) => (
        <View style={styles.inputContainer}>
            <View style={[styles.inputWrapper, validationErrors[name] && styles.inputError]}>
                <MaterialCommunityIcons name={icon} size={20} color={theme.colors.text.muted} style={styles.inputIcon} />
                <TextInput
                    style={styles.input}
                    placeholder={placeholder}
                    keyboardType={keyboardType}
                    autoCapitalize={name === 'email' ? 'none' : 'words'}
                    value={formData[name]}
                    onChangeText={(val) => handleChange(name, val)}
                    secureTextEntry={secureTextEntry}
                    placeholderTextColor={theme.colors.text.muted}
                />
            </View>
            {validationErrors[name] && <Text style={styles.errorText}>{validationErrors[name]}</Text>}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.text.primary} />
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.title}>Create Account</Text>
                        <Text style={styles.subtitle}>Fill in your details to get started</Text>
                    </View>

                    <View style={styles.formContainer}>
                        {error && (
                            <View style={styles.errorBanner}>
                                <MaterialCommunityIcons name="alert-circle-outline" size={20} color={theme.colors.error} />
                                <Text style={styles.serverErrorText}>{error}</Text>
                            </View>
                        )}

                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                {renderInput('firstName', 'First Name', 'account-outline')}
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                {renderInput('lastName', 'Last Name', 'account-outline')}
                            </View>
                        </View>

                        {renderInput('email', 'Email Address', 'email-outline', 'email-address')}

                        <View style={styles.inputContainer}>
                            <PhoneInputField
                                value={formData.phone}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, phone: text });
                                }}
                                onFormattedChange={(text) => {
                                    setFormattedPhone(text);
                                }}
                                error={validationErrors.phone}
                            />
                        </View>

                        {renderInput('password', 'Password', 'lock-outline', 'default', true)}
                        {renderInput('confirmPassword', 'Confirm Password', 'lock-check-outline', 'default', true)}

                        <TouchableOpacity
                            style={styles.checkboxContainer}
                            onPress={() => setAgreeCGU(!agreeCGU)}
                        >
                            <View style={[styles.checkbox, agreeCGU && styles.checkboxActive]}>
                                {agreeCGU && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
                            </View>
                            <Text style={styles.checkboxLabel}>
                                I agree to the <Text style={styles.linkText}>Terms & Conditions</Text>
                            </Text>
                        </TouchableOpacity>
                        {validationErrors.cgu && <Text style={[styles.errorText, { marginBottom: 16 }]}>{validationErrors.cgu}</Text>}

                        <TouchableOpacity
                            style={[styles.registerBtn, (!agreeCGU || loading) && styles.registerBtnDisabled]}
                            onPress={handleRegister}
                            disabled={!agreeCGU || loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.registerBtnText}>Sign Up</Text>
                            )}
                        </TouchableOpacity>

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account? </Text>
                            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                                <Text style={styles.signInText}>Sign In</Text>
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
        backgroundColor: theme.colors.background,
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
        marginTop: 20,
        marginBottom: 30,
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
    },
    formContainer: {
        width: '100%',
    },
    row: {
        flexDirection: 'row',
    },
    errorBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEF2F2',
        padding: 12,
        borderRadius: 12,
        marginBottom: 20,
    },
    serverErrorText: {
        color: theme.colors.error,
        fontSize: 14,
        marginLeft: 8,
        fontWeight: '500',
    },
    inputContainer: {
        marginBottom: 16,
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
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: theme.colors.text.primary,
    },
    inputError: {
        borderColor: theme.colors.error,
        backgroundColor: '#FFF5F5',
    },
    errorText: {
        color: theme.colors.error,
        fontSize: 11,
        marginTop: 4,
        marginLeft: 4,
        fontWeight: '500',
    },
    phoneContainer: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        height: 60,
    },
    phoneTextContainer: {
        backgroundColor: 'transparent',
        paddingVertical: 0,
        borderRadius: 16,
    },
    phoneInputText: {
        fontSize: 14,
        color: theme.colors.text.primary,
        height: 60,
    },
    phoneCodeText: {
        fontSize: 14,
        color: theme.colors.text.primary,
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
        marginBottom: 16,
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 6,
        borderWidth: 2,
        borderColor: theme.colors.primary,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    checkboxActive: {
        backgroundColor: theme.colors.primary,
    },
    checkboxLabel: {
        fontSize: 14,
        color: theme.colors.text.secondary,
    },
    linkText: {
        color: theme.colors.primary,
        fontWeight: '600',
    },
    registerBtn: {
        backgroundColor: theme.colors.primary,
        height: 56,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },
    registerBtnDisabled: {
        backgroundColor: theme.colors.text.muted,
    },
    registerBtnText: {
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

export default RegisterScreen;
