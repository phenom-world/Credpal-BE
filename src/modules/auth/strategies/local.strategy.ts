import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AppException } from '../../../common/factory/exception.factory';
import { User } from '../../user/entities/user.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<Omit<User, 'password'>> {
    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new AppException('Email or Password is incorrect!', HttpStatus.BAD_REQUEST);
    }
    return user;
  }
}
