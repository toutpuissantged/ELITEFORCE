import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import BottomTabs from './BottomTabs';
import PaymentScreen from '../screens/PaymentScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import TrackingScreen from '../screens/TrackingScreen';

const Stack = createStackNavigator();

export default function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="BottomTabs" component={BottomTabs} />
      <Stack.Screen
        name="Payment"
        component={PaymentScreen}
        options={{ headerShown: true, title: 'Paiement' }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ headerShown: true, title: 'Détails du Service' }}
      />
      <Stack.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{ headerShown: true, title: 'Suivi Prestataire' }}
      />
    </Stack.Navigator>
  );
}