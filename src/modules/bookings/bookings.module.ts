import { Module } from '@nestjs/common';
import { BookingsService } from './booking.service';
import { BookingsController } from './booking.controller';

@Module({
  imports: [],              
  controllers: [BookingsController],
  providers: [BookingsService],
  exports: [BookingsService], 
})
export class BookingsModule {}
