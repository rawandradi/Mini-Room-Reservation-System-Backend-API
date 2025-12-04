import { CreateRoomDto, UpdateRoomDto, FilterRoomsDto } from './room.dto';
import { RoomRepo, RoomFilterInternal } from './room.repo';
import { SafeRoom } from './room.types';

export class RoomService {
  static async createRoom(ownerId: number, dto: CreateRoomDto): Promise<SafeRoom> {
    return RoomRepo.create(ownerId, dto);
  }

  static async updateRoom(
    id: number,
    ownerId: number,
    dto: UpdateRoomDto
  ): Promise<SafeRoom | null> {
    return RoomRepo.update(id, ownerId, dto);
  }

  static async getMyRooms(ownerId: number): Promise<SafeRoom[]> {
    return RoomRepo.findByOwner(ownerId);
  }

  static async findAvailableRooms(dto: FilterRoomsDto): Promise<SafeRoom[]> {
    const filters: RoomFilterInternal = {
      minPrice: dto.minPrice,
      maxPrice: dto.maxPrice,
      capacity: dto.capacity,
      startDate: dto.startDate ? new Date(dto.startDate) : undefined,
      endDate: dto.endDate ? new Date(dto.endDate) : undefined,
    };

    return RoomRepo.findAvailable(filters);
  }
}
