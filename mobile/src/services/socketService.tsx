import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAppSelector } from '../hooks/store';
import { io, Socket } from 'socket.io-client';
import { Alert } from 'react-native';
import { SOCKET_URL } from '../config';

interface SocketContextType {
  socket: Socket | null;
  joinBookingRoom: (bookingId: number | string) => void;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  joinBookingRoom: () => { },
});

export const useSocket = () => {
  return useContext(SocketContext);
};

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider = ({ children }: SocketProviderProps) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { token, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    let newSocket: Socket | null = null;

    if (isAuthenticated && token) {
      newSocket = io(SOCKET_URL, {
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
      newSocket.on('mission-completed', (data: { bookingId: number | string }) => {
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
  }, [isAuthenticated, token, SOCKET_URL]);

  const joinBookingRoom = (bookingId: number | string) => {
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