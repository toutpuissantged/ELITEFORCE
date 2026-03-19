const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');

const setupSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: '*', // Adjust for production
      methods: ['GET', 'POST']
    }
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.id}, Socket ID: ${socket.id}`);

    // Rejoindre la room d'une réservation spécifique
    socket.on('join-booking-room', (bookingId) => {
      const roomName = `booking_${bookingId}`;
      socket.join(roomName);
      console.log(`Socket ${socket.id} joined room ${roomName}`);
    });

    // Événement: provider-location
    socket.on('provider-location', (data) => {
      // data: { bookingId, latitude, longitude }
      const { bookingId, ...location } = data;
      const roomName = `booking_${bookingId}`;

      // Broadcast location to clients in the room
      io.to(roomName).emit('provider-location', location);
    });

    // The backend might emit these events triggered by HTTP controllers,
    // but providers can also emit them depending on the architecture.
    // For now, these are listeners for when providers update the status.
    socket.on('booking-status-update', (data) => {
      const { bookingId, status } = data;
      const roomName = `booking_${bookingId}`;

      io.to(roomName).emit('booking-status-update', { bookingId, status });

      if (status === 'COMPLETED') {
        io.to(roomName).emit('mission-completed', { bookingId });
      }
    });

    socket.on('disconnect', () => {
      console.log(`Socket ${socket.id} disconnected`);
    });
  });

  return io;
};

module.exports = setupSocket;