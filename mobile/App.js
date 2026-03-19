import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/AppNavigator';
import { SocketProvider } from './src/services/socketService';

export default function App() {
  return (
    <Provider store={store}>
      <SocketProvider>
        <AppNavigator />
      </SocketProvider>
    </Provider>
  );
}