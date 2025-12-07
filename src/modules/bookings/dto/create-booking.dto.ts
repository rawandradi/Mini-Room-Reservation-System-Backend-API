import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsInt, Min } from 'class-validator';

export class CreateBookingDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  roomId!: number;

  @ApiProperty({ example: '2025-12-10T12:00:00.000Z' })
  @IsDateString()
  startDate!: string;

  @ApiProperty({ example: '2025-12-12T10:00:00.000Z' })
  @IsDateString()
  endDate!: string;
}
