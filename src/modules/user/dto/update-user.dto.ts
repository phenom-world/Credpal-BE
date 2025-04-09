import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ description: 'User full name', example: 'John Doe' })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({
    description: 'Last login timestamp of the user',
    example: '2024-03-20T10:30:00Z',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  lastLogin?: Date;
}
