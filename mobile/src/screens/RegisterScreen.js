import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, setToken, setLoading, setError } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [agreeCGU, setAgreeCGU] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const API_URL = process.env.API_URL || 'http://localhost:3000'; // Defaulting for testing

  const validate = () => {
    let errors = {};
    if (!formData.firstName) errors.firstName = 'Prénom requis';
    if (!formData.lastName) errors.lastName = 'Nom requis';

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) errors.email = 'Email invalide';

    const phoneRegex = /^\+212\d{9}$/;
    if (!phoneRegex.test(formData.phone)) errors.phone = 'Format +212XXXXXXXXX attendu';

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(formData.password)) {
      errors.password = 'Min. 8 char, 1 majuscule, 1 chiffre';
    }

    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (!agreeCGU) {
      errors.cgu = 'Vous devez accepter les CGU';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const response = await axios.post(`${API_URL}/api/auth/register`, {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });

      const { user, token } = response.data;

      await AsyncStorage.setItem('token', token);
      dispatch(setToken(token));
      dispatch(setUser(user));

      // Navigation is handled automatically by AppNavigator switching to MainStack
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Erreur lors de l\'inscription';
      dispatch(setError(errorMsg));
      Alert.alert('Erreur', errorMsg);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const handleChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Créer un compte</Text>

      {error && <Text style={styles.serverError}>{error}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Prénom"
        value={formData.firstName}
        onChangeText={(val) => handleChange('firstName', val)}
      />
      {validationErrors.firstName && <Text style={styles.error}>{validationErrors.firstName}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={formData.lastName}
        onChangeText={(val) => handleChange('lastName', val)}
      />
      {validationErrors.lastName && <Text style={styles.error}>{validationErrors.lastName}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        value={formData.email}
        onChangeText={(val) => handleChange('email', val)}
      />
      {validationErrors.email && <Text style={styles.error}>{validationErrors.email}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Téléphone (+212...)"
        keyboardType="phone-pad"
        value={formData.phone}
        onChangeText={(val) => handleChange('phone', val)}
      />
      {validationErrors.phone && <Text style={styles.error}>{validationErrors.phone}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={formData.password}
        onChangeText={(val) => handleChange('password', val)}
      />
      {validationErrors.password && <Text style={styles.error}>{validationErrors.password}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Confirmer mot de passe"
        secureTextEntry
        value={formData.confirmPassword}
        onChangeText={(val) => handleChange('confirmPassword', val)}
      />
      {validationErrors.confirmPassword && <Text style={styles.error}>{validationErrors.confirmPassword}</Text>}

      <View style={styles.checkboxContainer}>
        <TouchableOpacity style={styles.checkbox} onPress={() => setAgreeCGU(!agreeCGU)}>
          {agreeCGU && <View style={styles.checkboxInner} />}
        </TouchableOpacity>
        <Text style={styles.label}>J'accepte les CGU</Text>
      </View>
      {validationErrors.cgu && <Text style={styles.error}>{validationErrors.cgu}</Text>}

      <TouchableOpacity
        style={[styles.button, (!agreeCGU || loading) && styles.buttonDisabled]}
        onPress={handleRegister}
        disabled={!agreeCGU || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>S'inscrire</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')} style={styles.linkContainer}>
        <Text style={styles.link}>Déjà un compte ? Se connecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, justifyContent: 'center', backgroundColor: '#fff' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20, textAlign: 'center', color: '#333' },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, marginBottom: 5, fontSize: 16 },
  error: { color: 'red', marginBottom: 10, fontSize: 12, marginLeft: 5 },
  serverError: { color: 'red', textAlign: 'center', marginBottom: 15, fontSize: 14, fontWeight: 'bold' },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5, marginTop: 10 },
  checkbox: { width: 20, height: 20, borderWidth: 1, borderColor: '#000', marginRight: 10, justifyContent: 'center', alignItems: 'center' },
  checkboxInner: { width: 12, height: 12, backgroundColor: '#2e64e5' },
  label: { fontSize: 16 },
  button: { backgroundColor: '#2e64e5', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  buttonDisabled: { backgroundColor: '#a0b4e6' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  linkContainer: { marginTop: 20, alignItems: 'center' },
  link: { color: '#2e64e5', fontSize: 16 },
});