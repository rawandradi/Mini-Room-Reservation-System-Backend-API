import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class UpdateRoomDto {
  @ApiProperty({ example: 'Room 101 (Renovated)', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 150, required: false })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  price?: number;

  @ApiProperty({ example: 4, required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  capacity?: number;

  @ApiProperty({ example: 'UNAVAILABLE', required: false })
  @IsOptional()
  @IsString()
  status?: string;
}
