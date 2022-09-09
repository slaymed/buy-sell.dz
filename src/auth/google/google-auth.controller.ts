import { GoogleAuthService } from './google-auth.service';
import { Controller, Post, Body } from '@nestjs/common';

import { ConfigService } from '@nestjs/config';

@Controller('auth/google')
export class GoogleAuthController {
  public constructor(
    private readonly configService: ConfigService,
    private readonly googleAuthService: GoogleAuthService,
  ) {}

  @Post('/authenticate')
  public async authenticate(@Body('idToken') idToken: string): Promise<any> {
    return this.googleAuthService.authenticate(idToken);
  }
}
