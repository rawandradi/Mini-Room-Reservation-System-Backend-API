import prisma from '../shared/prisma';
import { SafeRoom } from './room.types';

export interface RoomFilterInternal {
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  capacity?: number | undefined;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
}


export class RoomRepo {
  static async create(ownerId: number, data: any): Promise<SafeRoom> {
    const room = await prisma.room.create({
      data: {
        ...data,
        ownerId,
      },
    });

    return room as SafeRoom;
  }

  static async update(
    id: number,
    ownerId: number,
    data: any
  ): Promise<SafeRoom | null> {
    await prisma.room.updateMany({
      where: { id, ownerId },
      data,
    });

    const updated = await prisma.room.findUnique({ where: { id } });
    return updated as SafeRoom | null;
  }

  static async findByOwner(ownerId: number): Promise<SafeRoom[]> {
    const rooms = await prisma.room.findMany({
      where: { ownerId },
      orderBy: { id: 'desc' },
    });

    return rooms as SafeRoom[];
  }

  static async findAvailable(filters: RoomFilterInternal): Promise<SafeRoom[]> {
    const { minPrice, maxPrice, capacity, startDate, endDate } = filters;

    const where: any = {};

    if (capacity !== undefined) {
      where.capacity = { gte: capacity };
    }

    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {};
      if (minPrice !== undefined) where.price.gte = minPrice;
      if (maxPrice !== undefined) where.price.lte = maxPrice;
    }

    if (startDate && endDate) {
      where.bookings = {
        none: {
          status: { not: 'CANCELLED' },
          AND: [
            { startDate: { lt: endDate } },
            { endDate: { gt: startDate } },
          ],
        },
      };
    }

    const rooms = await prisma.room.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    return rooms as SafeRoom[];
  }
}
