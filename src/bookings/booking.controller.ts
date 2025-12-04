import { Response } from 'express';
import { AuthRequest } from '../shared/auth.middleware';
import { BookingService } from './booking.service';

export class BookingController {
  static async create(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const booking = await BookingService.createBooking(
        req.user.userId,
        req.body
      );
      res.status(201).json(booking);
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Booking failed' });
    }
  }

  static async myBookingsForGuest(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const bookings = await BookingService.getGuestBookings(req.user.userId);
      res.json(bookings);
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Failed to fetch bookings' });
    }
  }

  static async bookingsForOwner(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const bookings = await BookingService.getOwnerBookings(req.user.userId);
      res.json(bookings);
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Failed to fetch bookings' });
    }
  }

  static async allBookings(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const bookings = await BookingService.getAllBookings();
      res.json(bookings);
    } catch (err: any) {
      res.status(400).json({ message: err.message || 'Failed to fetch bookings' });
    }
  }

  static async cancel(req: AuthRequest, res: Response) {
    if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

    try {
      const id = Number(req.params.id);
      const booking = await BookingService.cancelBooking(
        id,
        req.user.userId,
        req.user.role
      );
      res.json(booking);
    } catch (err: any) {
      if (err.message === 'Forbidden') {
        return res.status(403).json({ message: 'Forbidden' });
      }
      if (err.message === 'Booking not found') {
        return res.status(404).json({ message: 'Booking not found' });
      }
      res.status(400).json({ message: err.message || 'Cancel failed' });
    }
  }
}
