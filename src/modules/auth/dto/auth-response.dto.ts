import { ApiProperty } from '@nestjs/swagger';

export class AuthResponseDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1..." })
  access_token!: string;
}
