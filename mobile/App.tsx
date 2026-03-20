import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { SocketProvider } from './src/services/socketService';
import { StripeProvider } from '@stripe/stripe-react-native';

// Fallback key if env is missing during test
const STRIPE_KEY = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx';

export default function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <StripeProvider publishableKey={STRIPE_KEY}>
          <AppNavigator />
        </StripeProvider>
      </SocketProvider>
    </Provider>
  );
}