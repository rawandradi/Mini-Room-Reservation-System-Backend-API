import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength, IsOptional, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'user@test.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({ example: 'User Name' })
  @IsString()
  name!: string;

  @ApiProperty({
    example: 'GUEST',
    enum: UserRole,
    required: false,
    description: 'User role (optional)'
  })
  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;
}
