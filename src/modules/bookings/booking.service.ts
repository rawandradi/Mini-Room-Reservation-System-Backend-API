import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus } from '@prisma/client';

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  
  async create(guestId: number, dto: CreateBookingDto) {
    const startDate = new Date(dto.startDate);
    const endDate = new Date(dto.endDate);

    if (startDate >= endDate) {
      throw new ForbiddenException('startDate must be before endDate');
    }

    const overlap = await this.prisma.booking.findFirst({
      where: {
        roomId: dto.roomId,
        status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
        AND: [
          { startDate: { lt: endDate } }, // existing.start < new.end
          { endDate: { gt: startDate } }, // existing.end   > new.start
        ],
      },
    });

    if (overlap) {
      throw new ForbiddenException('Room is not available in this date range');
    }

    return this.prisma.booking.create({
      data: {
        roomId: dto.roomId,
        guestId,
        startDate,
        endDate,
        status: BookingStatus.PENDING,
      },
    });
  }

  async cancel(bookingId: number, guestId: number) {
    const booking = await this.prisma.booking.findUnique({
      where: { id: bookingId },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    if (booking.guestId !== guestId) {
      throw new ForbiddenException('You can cancel only your own bookings');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      return booking;
    }

    return this.prisma.booking.update({
      where: { id: bookingId },
      data: {
        status: BookingStatus.CANCELLED,
      },
    });
  }

  
  async findForGuest(guestId: number) {
    return this.prisma.booking.findMany({
      where: { guestId },
      include: { room: true },
    });
  }

  
  async findForOwner(ownerId: number) {
    return this.prisma.booking.findMany({
      where: {
        room: {
          ownerId,
        },
      },
      include: { room: true, guest: true },
    });
  }


  async findAllForAdmin() {
    return this.prisma.booking.findMany({
      include: { room: true, guest: true },
    });
  }
}
