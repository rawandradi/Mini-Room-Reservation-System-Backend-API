import prisma from '../shared/prisma';
import { SafeBooking } from './booking.types';
import { BookingStatus } from '@prisma/client';

export class BookingRepo {
  static async hasOverlap(
    roomId: number,
    startDate: Date,
    endDate: Date
  ): Promise<boolean> {
    const count = await prisma.booking.count({
      where: {
        roomId,
        status: { not: 'CANCELLED' },
        startDate: { lt: endDate },
        endDate: { gt: startDate },
      },
    });

    return count > 0;
  }

  static async create(
    roomId: number,
    guestId: number,
    startDate: Date,
    endDate: Date
  ): Promise<SafeBooking> {
    const booking = await prisma.booking.create({
      data: {
        roomId,
        guestId,
        startDate,
        endDate,
      },
    });

    return booking as SafeBooking;
  }

  static async findByIdWithRoom(id: number) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        room: true,
      },
    });
  }

  static async findGuestBookings(guestId: number): Promise<SafeBooking[]> {
    const bookings = await prisma.booking.findMany({
      where: { guestId },
      orderBy: { startDate: 'desc' },
    });

    return bookings as SafeBooking[];
  }

  static async findOwnerBookings(ownerId: number) {
    const bookings = await prisma.booking.findMany({
      where: {
        room: {
          ownerId,
        },
      },
      include: {
        room: true,
        guest: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return bookings;
  }

  static async findAll() {
    return prisma.booking.findMany({
      include: {
        room: true,
        guest: true,
      },
      orderBy: { startDate: 'desc' },
    });
  }

  static async updateStatus(
    id: number,
    status: BookingStatus
  ): Promise<SafeBooking> {
    const booking = await prisma.booking.update({
      where: { id },
      data: { status },
    });

    return booking as SafeBooking;
  }
}
