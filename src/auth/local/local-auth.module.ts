import { forwardRef, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { LOCAL_STRATEGY } from './constants';

import { LocalAuthController } from './local-auth.controller';
import { LocalAuthService } from './local-auth.service';
import { LocalAuthStrategy } from './strategies';
import { RolesModule } from '../../users/roles/roles.module';
import { AuthModule } from '../auth.module';

@Module({
  imports: [
    PassportModule.register({
      defaultStrategy: LOCAL_STRATEGY,
      property: 'user',
      session: true,
    }),
    RolesModule,
    forwardRef(() => AuthModule),
  ],
  controllers: [LocalAuthController],
  providers: [LocalAuthService, LocalAuthStrategy],
})
export class LocalAuthModule {}
