import { GoogleAuthClientService } from './google-auth-client.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { GOOGLE_PASSWORD } from './constants';
import { UserType } from '../../users/enums';
import { User } from '../../typeorm/entities';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleAuthService {
  public constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly googleAuthClientService: GoogleAuthClientService,
  ) {}

  public async authenticate(idToken: string): Promise<any> {
    return this.googleAuthClientService.verifyIdToken(idToken);
  }
}
