import { ApiProperty } from '@nestjs/swagger';

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token for authentication' })
  accessToken: string;

  @ApiProperty({ description: 'Timestamp of the last successful login', nullable: true })
  lastLogin: Date | null;

  @ApiProperty({ description: 'Timestamp of the token expiry', nullable: true })
  tokenExpiry: Date | null;

  constructor(partial: Partial<LoginResponseDto>) {
    Object.assign(this, partial);
  }
}
