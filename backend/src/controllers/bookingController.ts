import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId, scheduledAt, address } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const service = await prisma.service.findUnique({
      where: { id: parseInt(serviceId) }
    });

    if (!service) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (!service.available) {
      return res.status(400).json({ message: 'Service is currently not available' });
    }

    const totalPrice = service.basePrice; // Simplified pricing logic, could add extras later

    const booking = await prisma.booking.create({
      data: {
        userId,
        serviceId: service.id,
        scheduledAt: new Date(scheduledAt),
        address,
        totalPrice,
      },
      include: {
        service: true,
      }
    });

    res.status(201).json(booking);
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const bookings = await prisma.booking.findMany({
      where: { userId },
      include: {
        service: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const cancelBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: parseInt(id) },
    });

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId !== userId) {
      return res.status(403).json({ message: 'Access denied: You do not own this booking' });
    }

    if (booking.status !== 'PENDING') {
      return res.status(400).json({ message: 'Only PENDING bookings can be cancelled' });
    }

    const cancelledBooking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status: 'CANCELLED' },
      include: { service: true }
    });

    res.json(cancelledBooking);
  } catch (error) {
    next(error);
  }
};

const getAllBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        service: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      },
      orderBy: {
        createdAt: 'desc',
      }
    });

    res.json(bookings);
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    const booking = await prisma.booking.update({
      where: { id: parseInt(id) },
      data: { status },
      include: { user: true, service: true }
    });

    res.json(booking);
  } catch (error) {
    next(error);
  }
};

export {
  createBooking,
  getMyBookings,
  cancelBooking,
  getAllBookings,
  updateBookingStatus,
};