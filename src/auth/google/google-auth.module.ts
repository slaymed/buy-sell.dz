import { forwardRef, Module } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { AuthModule } from '../auth.module';
import { GoogleAuthClientService } from './google-auth-client.service';
import { GoogleAuthController } from './google-auth.controller';
import { GoogleAuthService } from './google-auth.service';

@Module({
  imports: [forwardRef(() => AuthModule)],
  controllers: [GoogleAuthController],
  providers: [GoogleAuthService, GoogleAuthClientService],
})
export class GoogleAuthModule {}
