import { HttpException, HttpStatus } from '@nestjs/common';
import { ValidationError } from 'class-validator';

import { ErrorResponse } from '../dto/response.dto';

export class AppException extends HttpException {
  constructor(message: string, statusCode: HttpStatus) {
    super({ message, statusCode }, statusCode);
  }
}

function parseError(err: ValidationError[], res: ErrorResponse[] = []) {
  err.forEach((el: ValidationError) => {
    if (!el.children || el.children.length === 0) {
      if (el.constraints) {
        res.push({
          field: el.property,
          message: Object.values(el.constraints).toString(),
        });
      }
    } else {
      parseError(el.children, res);
    }
  });

  return res;
}

export function validationPipeException(err: ValidationError[]) {
  const errors = parseError(err);
  const message = errors.map((e) => e.message).join(', ');
  return new AppException(message, HttpStatus.BAD_REQUEST);
}

export class UnauthorizedRouteException extends AppException {
  constructor(message = 'Unauthorized to access this route') {
    super(message, HttpStatus.FORBIDDEN);
  }
}
