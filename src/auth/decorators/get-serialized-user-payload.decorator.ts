import { SerializedUserPayload } from '../types';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetSerializedUserPayload = createParamDecorator(
  (data: keyof SerializedUserPayload | undefined, ctx: ExecutionContext) => {
    if (typeof data === 'string' && data.trim())
      return ctx.switchToHttp().getRequest().user[data];

    return ctx.switchToHttp().getRequest().user;
  },
);
