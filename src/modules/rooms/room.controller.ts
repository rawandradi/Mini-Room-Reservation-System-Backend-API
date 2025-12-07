import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { RoomsService } from './room.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

@Post()
@Roles(UserRole.OWNER)
createRoom(
  @Body() body: CreateRoomDto,
  @CurrentUser('userId') ownerId: number,
) {
  return this.roomsService.create(ownerId, body);
}


@Get()
listRooms(
  @Query('minPrice') minPrice?: string,
  @Query('maxPrice') maxPrice?: string,
  @Query('capacity') capacity?: string,
  @Query('startDate') startDate?: string,
  @Query('endDate') endDate?: string,
) {
  const filters: {
    minPrice?: number;
    maxPrice?: number;
    capacity?: number;
    startDate?: Date;
    endDate?: Date;
  } = {};

  if (minPrice !== undefined) filters.minPrice = Number(minPrice);
  if (maxPrice !== undefined) filters.maxPrice = Number(maxPrice);
  if (capacity !== undefined) filters.capacity = Number(capacity);
  if (startDate && endDate) {
    filters.startDate = new Date(startDate);
    filters.endDate = new Date(endDate);
  }

  return this.roomsService.findAll(filters);
}


  @Get(':id')
  getRoom(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.OWNER)
  updateRoom(
    @Param('id') id: string,
    @Body() body: UpdateRoomDto,
    @Req() req: any,
  ) {
    const ownerId = req.user.userId;
    return this.roomsService.update(+id, body);
  }
}
