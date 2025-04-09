import { HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { config } from 'node-config-ts';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AppException } from '../../../common/factory/exception.factory';
import { UserService } from '../../user/user.service';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private UserService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.JWT_CONFIG.SECRET,
    });
  }

  async validate(payload: JwtPayload) {
    try {
      const user = await this.UserService.findOne(payload.id);
      if (!user) {
        throw new AppException('Unauthorized to access this route', HttpStatus.UNAUTHORIZED);
      }
      return { id: payload.id, email: payload.email };
    } catch {
      throw new AppException('Unauthorized to access this route', HttpStatus.UNAUTHORIZED);
    }
  }
}
