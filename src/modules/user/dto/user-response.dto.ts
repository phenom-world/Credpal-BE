import { ApiProperty } from '@nestjs/swagger';

import { exclude } from '../../../common/utils';
import type { User } from '../entities/user.entity';
import { UserRole } from '../enum/user.enum';

export class UserResponseDto {
  @ApiProperty({ description: 'The unique identifier of the user' })
  id: string;

  @ApiProperty({ description: 'The email address of the user' })
  email: string;

  @ApiProperty({ description: 'The first name of the user' })
  firstName: string;

  @ApiProperty({ description: 'The last name of the user' })
  lastName: string;

  @ApiProperty({ description: 'Whether the user account is active' })
  isActive: boolean;

  @ApiProperty({ enum: UserRole, description: 'The role of the user' })
  role: UserRole;

  @ApiProperty({ description: 'The last login timestamp of the user' })
  lastLogin: Date;

  @ApiProperty({ description: 'The date when the user was created' })
  createdAt: Date;

  @ApiProperty({ description: 'The date when the user was last updated' })
  updatedAt: Date;

  constructor(partial: Partial<User>) {
    const userWithoutPassword = exclude(partial, ['password']);
    Object.assign(this, userWithoutPassword);
  }
}
