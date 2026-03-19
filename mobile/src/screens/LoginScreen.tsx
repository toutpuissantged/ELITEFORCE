import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { setUser, setToken, setLoading, setError } from '../store/authSlice';
import { useAppDispatch, useAppSelector } from '../hooks/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { StackScreenProps } from '@react-navigation/stack';
import { AuthStackParamList } from '../types/navigation';
import axios from 'axios';

type Props = StackScreenProps<AuthStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useAppDispatch();
    const { loading, error } = useAppSelector((state) => state.auth);

    const API_URL = process.env.API_URL || 'http://localhost:3000';

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
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

            // Automatically navigate to MainStack because isAuthenticated changes
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Identifiants incorrects';
            dispatch(setError(errorMsg));
            Alert.alert('Erreur', errorMsg);
        } finally {
            dispatch(setLoading(false));
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Connexion</Text>

            {error && <Text style={styles.serverError}>{error}</Text>}

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    style={styles.passwordInput}
                    placeholder="Mot de passe"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                    <MaterialCommunityIcons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#888" />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
            >
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Se connecter</Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={styles.linkContainer}>
                <Text style={styles.link}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.linkContainer}>
                <Text style={styles.link}>Pas encore de compte ? S'inscrire</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
    title: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center', color: '#333' },
    input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 15, fontSize: 16 },
    passwordContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#ccc', borderRadius: 8, marginBottom: 15 },
    passwordInput: { flex: 1, padding: 12, fontSize: 16 },
    eyeIcon: { padding: 10 },
    serverError: { color: 'red', textAlign: 'center', marginBottom: 15, fontSize: 14, fontWeight: 'bold' },
    button: { backgroundColor: '#2e64e5', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
    buttonDisabled: { backgroundColor: '#a0b4e6' },
    buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
    linkContainer: { marginTop: 20, alignItems: 'center' },
    link: { color: '#2e64e5', fontSize: 16 },
});
