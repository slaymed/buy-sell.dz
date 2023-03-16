import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { OAuth2Client } from 'google-auth-library';
import { ParamsValidator } from '../../class-validator';

import { AuthModule } from '../auth.module';
import { GOOGLE_STRATEGY } from './constants';
import { GoogleAuthClientService } from './google-auth-client.service';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';
import { GoogleAuthStrategy } from './strategies/google-auth.strategy';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    PassportModule.register({
      defaultStrategy: GOOGLE_STRATEGY,
      property: 'user',
      session: true,
    }),
  ],
  controllers: [GoogleAuthController],
  providers: [
    GoogleAuthService,
    GoogleAuthStrategy,
    GoogleAuthClientService,
    ParamsValidator,
  ],
})
export class GoogleAuthModule {}
