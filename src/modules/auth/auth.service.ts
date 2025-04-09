import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { config } from 'node-config-ts';

import { AppException } from '../../common/factory/exception.factory';
import { exclude } from '../../common/utils';
import { UserResponseDto } from '../user/dto/user-response.dto';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import type { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
@Injectable()
export class AuthService {
  constructor(
    private UserService: UserService,
    private jwtService: JwtService
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { email } = loginDto;
    const user = await this.UserService.getUserWithPasswordByEmail(email);

    if (!user || !user.isActive) {
      throw new AppException('User is inactive', HttpStatus.UNAUTHORIZED);
    }

    const payload: JwtPayload = { id: user.id, email: user.email };

    const accessToken = this.jwtService.sign(payload, {
      secret: config.JWT_CONFIG.SECRET,
      expiresIn: config.JWT_CONFIG.EXPIRES_IN,
    });

    const updatedUser = await this.UserService.update(user.id, { lastLogin: new Date() });
    return {
      accessToken,
      lastLogin: updatedUser.lastLogin,
      tokenExpiry: new Date(Date.now() + 86400000),
    };
  }

  async validateUser(email: string, pass: string): Promise<Omit<User, 'password'> | null> {
    const user = await this.UserService.getUserWithPasswordByEmail(email);
    if (user) {
      const result = await bcrypt.compare(pass, user.password);
      if (result) {
        const userWithoutPassword = exclude(user, ['password']);
        return userWithoutPassword;
      }
    }
    return null;
  }

  async getUserProfile(user: User): Promise<UserResponseDto> {
    const userProfile = await this.UserService.findOne(user.id);
    return new UserResponseDto(userProfile);
  }
}
