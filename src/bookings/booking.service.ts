import { CreateBookingDto } from './booking.dto';
import { BookingRepo } from './booking.repo';
import { SafeBooking } from './booking.types';
import prisma from '../shared/prisma';
import { BookingStatus, UserRole } from '@prisma/client';

export class BookingService {
  static async createBooking(
    guestId: number,
    dto: CreateBookingDto
  ): Promise<SafeBooking> {
    const roomId = dto.roomId;
    const start = new Date(dto.startDate);
    const end = new Date(dto.endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error('Invalid date format');
    }

    if (end <= start) {
      throw new Error('endDate must be after startDate');
    }

    // تأكد أن الغرفة موجودة و ACTIVE
    const room = await prisma.room.findUnique({
      where: { id: roomId },
    });

    if (!room || room.status !== 'ACTIVE') {
      throw new Error('Room not available');
    }

    const overlap = await BookingRepo.hasOverlap(roomId, start, end);
    if (overlap) {
      throw new Error('Room is already booked in this period');
    }

    return BookingRepo.create(roomId, guestId, start, end);
  }

  static async getGuestBookings(guestId: number): Promise<SafeBooking[]> {
    return BookingRepo.findGuestBookings(guestId);
  }

  static async getOwnerBookings(ownerId: number) {
    return BookingRepo.findOwnerBookings(ownerId);
  }

  static async getAllBookings() {
    return BookingRepo.findAll();
  }

  static async cancelBooking(
    bookingId: number,
    actorId: number,
    actorRole: UserRole
  ): Promise<SafeBooking> {
    const booking = await BookingRepo.findByIdWithRoom(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const isGuestOwner = booking.guestId === actorId;
    const isRoomOwner = booking.room.ownerId === actorId;
    const isAdmin = actorRole === 'ADMIN';

    if (
      actorRole === 'GUEST' &&
      !isGuestOwner
    ) {
      throw new Error('Forbidden');
    }

    if (
      actorRole === 'OWNER' &&
      !isRoomOwner
    ) {
      throw new Error('Forbidden');
    }

    if (actorRole === 'ADMIN' || isGuestOwner || isRoomOwner) {
      if (booking.status === 'CANCELLED') {
        return booking as SafeBooking; // لا شيء يفعله
      }

      return BookingRepo.updateStatus(bookingId, BookingStatus.CANCELLED);
    }

    throw new Error('Forbidden');
  }
}
