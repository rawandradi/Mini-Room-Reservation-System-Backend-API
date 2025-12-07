import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { BookingsService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { RolesGuard } from '../../common/guards/roles.guard';
import { UserRole } from '@prisma/client';
import { CurrentUser } from '../../common/decorators/current-user.decorator';


@Controller('bookings')
@UseGuards(JwtAuthGuard, RolesGuard) 
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
@Roles(UserRole.GUEST)
createBooking(@Body() dto: CreateBookingDto, @CurrentUser('userId') guestId: number) {
  return this.bookingsService.create(guestId, dto);
}

  @Delete(':id')
  @Roles(UserRole.GUEST)
  cancelBooking(@Param('id') id: string, @Req() req: any) {
    const guestId = req.user.userId;
    return this.bookingsService.cancel(+id, guestId);
  }

  @Get('my')
  @Roles(UserRole.GUEST)
  myBookings(@Req() req: any) {
    const guestId = req.user.userId;
    return this.bookingsService.findForGuest(guestId);
  }

  @Get('owner')
  @Roles(UserRole.OWNER)
  ownerBookings(@Req() req: any) {
    const ownerId = req.user.userId;
    return this.bookingsService.findForOwner(ownerId);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  adminBookings() {
    return this.bookingsService.findAllForAdmin();
  }
}
