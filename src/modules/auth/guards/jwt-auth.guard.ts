import { HttpStatus, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { AppException } from '../../../common/factory/exception.factory';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: any, user: any, _info: any) {
    if (err || !user) {
      throw err || new AppException('Unauthorized to access this route', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
