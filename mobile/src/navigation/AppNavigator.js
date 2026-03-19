import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { setToken, setUser, setLoading } from '../store/authSlice';
import axios from 'axios';
import { registerForPushNotificationsAsync } from '../services/notificationService';
import * as Notifications from 'expo-notifications';

import AuthStack from './AuthStack';
import MainStack from './MainStack';

export default function AppNavigator() {
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const API_URL = process.env.API_URL || 'http://localhost:3000';

  useEffect(() => {
    const bootstrapAsync = async () => {
      dispatch(setLoading(true));
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          // Verify token and fetch user details
          const response = await axios.get(`${API_URL}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          dispatch(setUser(response.data.user));
          dispatch(setToken(token));

          // Set up push notifications
          const pushToken = await registerForPushNotificationsAsync();
          if (pushToken) {
            try {
              await axios.put(`${API_URL}/api/auth/push-token`, { pushToken }, {
                headers: { Authorization: `Bearer ${token}` }
              });
            } catch (err) {
              console.log('Error saving push token to backend:', err);
            }
          }
        }
      } catch (e) {
        // Token invalid or expired
        console.log('Error restoring token:', e);
        await AsyncStorage.removeItem('token');
      } finally {
        dispatch(setLoading(false));
      }
    };

    bootstrapAsync();
  }, []);

  if (loading) {
    // We could render a splash screen here
    return null;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
}