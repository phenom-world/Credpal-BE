import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

import { UserRole } from '../enum/user.enum';

export class CreateUserDto {
  @ApiProperty({ description: 'User email address', example: 'user@example.com' })
  @IsNotEmpty()
  @IsEmail()
  readonly email!: string;

  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @IsNotEmpty()
  @IsString()
  readonly fullName!: string;

  @ApiProperty({ description: 'User password (minimum 8 characters)', example: 'password123' })
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  readonly password!: string;

  @ApiProperty({ description: 'ToC Agreed', example: true })
  @IsNotEmpty()
  @IsBoolean()
  readonly tocAgreed!: boolean;

  @ApiProperty({
    description: 'User role',
    enum: UserRole,
    default: UserRole.USER,
    example: UserRole.USER,
  })
  @IsOptional()
  @IsString()
  @IsIn(Object.values(UserRole))
  readonly role?: UserRole = UserRole.USER;
}
