import { Module } from '@nestjs/common';
import { RoomsController } from './room.controller';
import { RoomsService } from './room.service';

@Module({
  controllers: [RoomsController],
  providers: [RoomsService],
  exports: [RoomsService],
})
export class RoomsModule {}
