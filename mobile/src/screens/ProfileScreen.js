import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { logout } from '../store/authSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileScreen({ navigation }) {
  const { user, token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const API_URL = process.env.API_URL || 'http://localhost:3000';

  const handleLogout = async () => {
    try {
      // Optional: Call the backend to invalidate token if implemented
      await axios.post(`${API_URL}/api/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (e) {
      console.error(e);
    } finally {
      await AsyncStorage.removeItem('token');
      dispatch(logout());
      // Navigation resets to AuthStack automatically
    }
  };

  const confirmLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Voulez-vous vraiment vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnexion', onPress: handleLogout, style: 'destructive' },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <MaterialCommunityIcons name="account" size={60} color="#fff" />
        </View>
        <Text style={styles.nameText}>{user?.firstName} {user?.lastName}</Text>
        <Text style={styles.emailText}>{user?.email}</Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="phone" size={24} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Téléphone</Text>
            <Text style={styles.infoValue}>{user?.phone || 'Non renseigné'}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="shield-account" size={24} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Rôle</Text>
            <Text style={styles.infoValue}>{user?.role}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar-month" size={24} color="#666" />
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Membre depuis</Text>
            <Text style={styles.infoValue}>
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={confirmLogout}>
        <MaterialCommunityIcons name="logout" size={24} color="#FF3B30" />
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    backgroundColor: '#2e64e5',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  nameText: { fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  emailText: { fontSize: 16, color: '#e0e0e0' },
  infoSection: {
    backgroundColor: '#fff',
    marginTop: 20,
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoContent: { marginLeft: 15, borderBottomWidth: 1, borderBottomColor: '#eee', flex: 1, paddingBottom: 10 },
  infoLabel: { fontSize: 14, color: '#888', marginBottom: 5 },
  infoValue: { fontSize: 16, color: '#333', fontWeight: '500' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 30,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: { fontSize: 18, color: '#FF3B30', fontWeight: 'bold', marginLeft: 10 },
});