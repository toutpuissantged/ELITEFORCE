import React, { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { Alert } from 'react-native';

const SocketContext = createContext();

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const { token, isAuthenticated } = useSelector((state) => state.auth);

  const API_URL = process.env.API_URL || 'http://localhost:3000';

  useEffect(() => {
    let newSocket = null;

    if (isAuthenticated && token) {
      newSocket = io(API_URL, {
        auth: { token },
        transports: ['websocket'],
      });

      newSocket.on('connect', () => {
        console.log('Connected to socket server');
      });

      newSocket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });

      // Global listeners for real-time events can be added here or in specific components
      newSocket.on('mission-completed', (data) => {
        Alert.alert(
          'Mission terminée',
          `La mission pour la réservation #${data.bookingId} est terminée. N'oubliez pas de noter votre prestataire !`
        );
      });

      setSocket(newSocket);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [isAuthenticated, token]);

  const joinBookingRoom = (bookingId) => {
    if (socket) {
      socket.emit('join-booking-room', bookingId);
      console.log(`Joined room for booking ${bookingId}`);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, joinBookingRoom }}>
      {children}
    </SocketContext.Provider>
  );
};