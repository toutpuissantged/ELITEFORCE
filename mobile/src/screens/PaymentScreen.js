import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useSelector } from 'react-redux';
import { CardField, useStripe, StripeProvider } from '@stripe/stripe-react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import axios from 'axios';

const PaymentScreenContent = ({ route, navigation }) => {
  const { bookingId, amount, serviceName } = route.params;
  const { user, token } = useSelector((state) => state.auth);

  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isCardComplete, setIsCardComplete] = useState(false);

  const { confirmPayment } = useStripe();
  const API_URL = process.env.API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchPaymentIntent();
  }, []);

  const fetchPaymentIntent = async () => {
    try {
      const response = await axios.post(
        `${API_URL}/api/payments/create-intent`,
        { bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClientSecret(response.data.clientSecret);
    } catch (error) {
      console.error('Error fetching payment intent:', error);
      Alert.alert('Erreur', 'Impossible de préparer le paiement.');
      navigation.goBack();
    }
  };

  const handlePayment = async () => {
    if (!clientSecret) return;

    setLoading(true);

    try {
      const { error, paymentIntent } = await confirmPayment(clientSecret, {
        paymentMethodType: 'Card',
        paymentMethodData: {
          billingDetails: {
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
          },
        },
      });

      if (error) {
        Alert.alert('Échec du paiement', error.message);
      } else if (paymentIntent) {
        Alert.alert('Succès', 'Votre paiement a été traité avec succès !', [
          { text: 'OK', onPress: () => navigation.navigate('BottomTabs', { screen: 'Bookings' }) }
        ]);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors du paiement.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Récapitulatif de la commande</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>Service: <Text style={styles.bold}>{serviceName || `Réservation #${bookingId}`}</Text></Text>
        <Text style={styles.summaryText}>Montant total: <Text style={styles.boldAmount}>{amount} Dhs</Text></Text>
      </View>

      <Text style={styles.label}>Détails de la carte</Text>
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: 'Numéro de carte',
        }}
        cardStyle={{
          backgroundColor: '#FFFFFF',
          textColor: '#000000',
        }}
        style={styles.cardField}
        onCardChange={(cardDetails) => {
          setIsCardComplete(cardDetails.complete);
        }}
      />

      <View style={styles.securityContainer}>
        <MaterialCommunityIcons name="lock" size={16} color="#4CAF50" />
        <Text style={styles.securityText}>Paiement sécurisé par Stripe</Text>
      </View>

      <TouchableOpacity
        style={[styles.payButton, (!isCardComplete || !clientSecret || loading) && styles.payButtonDisabled]}
        onPress={handlePayment}
        disabled={!isCardComplete || !clientSecret || loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.payButtonText}>Payer {amount} Dhs</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default function PaymentScreen({ route, navigation }) {
  const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx'; // Dummy fallback key

  return (
    <StripeProvider
      publishableKey={STRIPE_PUBLISHABLE_KEY}
    >
      <PaymentScreenContent route={route} navigation={navigation} />
    </StripeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  summaryCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
  bold: {
    fontWeight: 'bold',
    color: '#333',
  },
  boldAmount: {
    fontWeight: 'bold',
    color: '#2e64e5',
    fontSize: 18,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  securityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  securityText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 5,
  },
  payButton: {
    backgroundColor: '#2e64e5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  payButtonDisabled: {
    backgroundColor: '#a0b4e6',
  },
  payButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});