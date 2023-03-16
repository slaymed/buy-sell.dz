import { GoogleAuthClientService } from './google-auth-client.service';
import { ConfigService } from '@nestjs/config';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';

import { GOOGLE_PASSWORD } from './constants';
import { UserType } from '../../users/enums';
import { User } from '../../typeorm/entities';
import { AuthService } from '../auth.service';
import { GoogleAuthPayloadDto } from './dto';
import { ParamsValidator } from '../../class-validator';

@Injectable()
export class GoogleAuthService {
  public constructor(
    private readonly configService: ConfigService,
    private readonly authService: AuthService,
    private readonly googleAuthClientService: GoogleAuthClientService,
    private readonly paramsValidator: ParamsValidator,
  ) {}

  public async authenticate(idToken: string): Promise<User> {
    const ticket = await this.googleAuthClientService.verifyIdToken(idToken);

    const payload = ticket.getPayload();

    const googleAuthPayloadDto = new GoogleAuthPayloadDto({
      email: payload.email,
    });
    await this.paramsValidator.validate(googleAuthPayloadDto);

    return this.authService.authenticate({
      email: googleAuthPayloadDto.email,
      password: this.configService.get<string>(GOOGLE_PASSWORD),
      from: UserType.GOOGLE,
    });
  }
}
