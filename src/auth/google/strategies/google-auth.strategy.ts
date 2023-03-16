import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Strategy } from 'passport-custom';
import { User } from '../../../typeorm/entities';
import { GOOGLE_STRATEGY } from '../constants';
import { GoogleAuthService } from '../google-auth.service';
import { SerializedUserPayload } from 'src/auth/types';

@Injectable()
export class GoogleAuthStrategy extends PassportStrategy(
  Strategy,
  GOOGLE_STRATEGY,
) {
  public constructor(private readonly googleAuthService: GoogleAuthService) {
    super();
  }

  public async validate(req: Request): Promise<SerializedUserPayload> {
    const user = await this.googleAuthService.authenticate(req.body.idToken);
    return { email: user.email, from: user.from };
  }
}
