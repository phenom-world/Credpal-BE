import { createParamDecorator, type ExecutionContext } from '@nestjs/common';

export const AuthUser = createParamDecorator((field: 'id' | 'email', ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return field ? request.user[field] : request.user;
});
