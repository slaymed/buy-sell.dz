import { User } from '../../typeorm/entities/user.entity';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    if (typeof data === 'string' && data.trim())
      return ctx.switchToHttp().getRequest().user[data];

    return ctx.switchToHttp().getRequest().user;
  },
);
