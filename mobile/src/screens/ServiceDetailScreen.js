import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

export default function ServiceDetailScreen({ route, navigation }) {
  const { service } = route.params;
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);

  // Basic booking form data
  const [address, setAddress] = useState('');
  // In a real app we'd use a DatePicker. For simplicity, we default to tomorrow.
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const [scheduledAt, setScheduledAt] = useState(tomorrow.toISOString());

  const API_URL = process.env.API_URL || 'http://localhost:3000';

  const handleBooking = async () => {
    if (!address) {
      Alert.alert('Erreur', 'Veuillez saisir une adresse pour la prestation.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_URL}/api/bookings`,
        {
          serviceId: service.id,
          scheduledAt,
          address,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newBooking = response.data;

      Alert.alert(
        'Succès',
        'Réservation créée avec succès. Vous allez être redirigé vers le paiement.',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Payment', {
              bookingId: newBooking.id,
              amount: newBooking.totalPrice,
              serviceName: service.name
            })
          }
        ]
      );
    } catch (error) {
      console.error(error);
      const errorMsg = error.response?.data?.message || 'Erreur lors de la réservation';
      Alert.alert('Erreur', errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <MaterialCommunityIcons name="tools" size={48} color="#2e64e5" />
        </View>
        <Text style={styles.serviceName}>{service.name}</Text>
        <Text style={styles.category}>{service.category}</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{service.description}</Text>

        <View style={styles.row}>
          <MaterialCommunityIcons name="cash" size={20} color="#666" />
          <Text style={styles.rowText}>Prix de base: <Text style={styles.bold}>{service.basePrice} Dhs</Text></Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="clock-outline" size={20} color="#666" />
          <Text style={styles.rowText}>Durée estimée: <Text style={styles.bold}>{service.duration} min</Text></Text>
        </View>

        <View style={styles.row}>
          <MaterialCommunityIcons name="star" size={20} color="#FFD700" />
          <Text style={styles.rowText}>Note: <Text style={styles.bold}>{service.rating} / 5</Text></Text>
        </View>
      </View>

      <View style={styles.bookingSection}>
        <Text style={styles.sectionTitle}>Réserver ce service</Text>

        <Text style={styles.label}>Adresse d'intervention</Text>
        <TextInput
          style={styles.input}
          placeholder="Ex: 12 Rue des Lilas, Casablanca"
          value={address}
          onChangeText={setAddress}
          multiline
        />

        <Text style={styles.label}>Date et heure souhaitées</Text>
        <TextInput
          style={styles.input}
          value={new Date(scheduledAt).toLocaleString()}
          editable={false}
        />
        <Text style={styles.hint}>Pour ce test, la date est fixée à demain.</Text>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleBooking}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Confirmer et Payer</Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: { backgroundColor: '#fff', alignItems: 'center', padding: 30, borderBottomWidth: 1, borderBottomColor: '#eee' },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#e6eeff', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  serviceName: { fontSize: 24, fontWeight: 'bold', color: '#333', textAlign: 'center' },
  category: { fontSize: 16, color: '#888', marginTop: 5 },
  infoSection: { backgroundColor: '#fff', marginTop: 15, padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  description: { fontSize: 15, color: '#666', lineHeight: 22, marginBottom: 20 },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  rowText: { fontSize: 15, color: '#444', marginLeft: 10 },
  bold: { fontWeight: 'bold', color: '#333' },
  bookingSection: { backgroundColor: '#fff', marginTop: 15, padding: 20, marginBottom: 30 },
  label: { fontSize: 14, fontWeight: 'bold', color: '#555', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 16, marginBottom: 5, backgroundColor: '#fafafa' },
  hint: { fontSize: 12, color: '#888', marginBottom: 20 },
  button: { backgroundColor: '#2e64e5', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonDisabled: { backgroundColor: '#a0b4e6' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});