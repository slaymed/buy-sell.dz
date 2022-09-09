import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { RolesModule } from '../users/roles/roles.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthModule } from './google/google-auth.module';
import { LocalAuthModule } from './local/local-auth.module';
import { SessionSerializer } from './serializers';

@Module({
  imports: [LocalAuthModule, GoogleAuthModule, UsersModule, RolesModule],
  controllers: [AuthController],
  providers: [AuthService, SessionSerializer],
  exports: [AuthService],
})
export class AuthModule {}
