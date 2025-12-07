import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsPositive, IsString, Min } from 'class-validator';

export class CreateRoomDto {
  @ApiProperty({ example: 'Room 101' })
  @IsString()
  name!: string;

  @ApiProperty({ example: 120 })
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiProperty({ example: 3 })
  @IsNumber()
  @Min(1)
  capacity!: number;

  @ApiProperty({
    example: 'AVAILABLE',
    required: false,
    description: 'Room status (optional, DB can set default)',
  })
  @IsOptional()
  @IsString()
  status?: string;
}
