import { Response } from 'express';
import { AuthRequest } from '../shared/auth.middleware';
import { RoomService } from './room.service';
import { FilterRoomsDto } from './room.dto';

export class RoomController {
  static async create(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const room = await RoomService.createRoom(req.user.userId, req.body);
      return res.status(201).json(room);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Create room failed' });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const id = Number(req.params.id);
      const room = await RoomService.updateRoom(id, req.user.userId, req.body);
      if (!room) {
        return res.status(404).json({ message: 'Room not found or not owned by you' });
      }
      return res.json(room);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Update room failed' });
    }
  }

  static async myRooms(req: AuthRequest, res: Response) {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
      const rooms = await RoomService.getMyRooms(req.user.userId);
      return res.json(rooms);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Failed to fetch rooms' });
    }
  }

  static async available(req: AuthRequest, res: Response) {
    const { minPrice, maxPrice, capacity, startDate, endDate } = req.query;

    const filters: FilterRoomsDto = {
      minPrice: minPrice !== undefined ? Number(minPrice) : undefined,
      maxPrice: maxPrice !== undefined ? Number(maxPrice) : undefined,
      capacity: capacity !== undefined ? Number(capacity) : undefined,
      startDate: startDate !== undefined ? String(startDate) : undefined,
      endDate: endDate !== undefined ? String(endDate) : undefined,
    };

    try {
      const rooms = await RoomService.findAvailableRooms(filters);
      return res.json(rooms);
    } catch (err: any) {
      return res.status(400).json({ message: err.message || 'Failed to fetch available rooms' });
    }
  }
}
