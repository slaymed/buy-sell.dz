import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GOOGLE_STRATEGY } from '../constants';

export class GoogleAuthGuard extends AuthGuard(GOOGLE_STRATEGY) {
  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const result = (await super.canActivate(context)) as boolean;
    await super.logIn(context.switchToHttp().getRequest());

    return result;
  }
}
