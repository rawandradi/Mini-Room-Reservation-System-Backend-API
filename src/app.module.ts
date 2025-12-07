import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { RoomsModule } from './modules/rooms/room.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

@Module({
  imports: [PrismaModule, RoomsModule,BookingsModule,UsersModule,AuthModule,],
})
export class AppModule {}
