import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { BookingStatus } from '@prisma/client'; // add this

@Injectable()
export class RoomsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: number, data: CreateRoomDto) {
    return this.prisma.room.create({
      data: {
        ...data,
        ownerId,
      },
    });
  }

   async findAll(filters: {
    minPrice?: number;
    maxPrice?: number;
    capacity?: number;
    startDate?: Date;
    endDate?: Date;
  }) {
    const { minPrice, maxPrice, capacity, startDate, endDate } = filters;

    return this.prisma.room.findMany({
      where: {
        ...(minPrice !== undefined && { price: { gte: minPrice } }),
        ...(maxPrice !== undefined && { price: { lte: maxPrice } }),
        ...(capacity !== undefined && { capacity: { gte: capacity } }),
        ...(startDate &&
          endDate && {
            bookings: {
              none: {
                status: { in: [BookingStatus.PENDING, BookingStatus.CONFIRMED] },
                startDate: { lt: endDate },
                endDate: { gt: startDate },
              },
            },
          }),
      },
    });
  }

  async findOne(id: number) {
    const room = await this.prisma.room.findUnique({ where: { id } });
    if (!room) throw new NotFoundException('Room not found');
    return room;
  }

  async update(id: number, data: UpdateRoomDto) {
    return this.prisma.room.update({
      where: { id },
      data,
    });
  }
}
