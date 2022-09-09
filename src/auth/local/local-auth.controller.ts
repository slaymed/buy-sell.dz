import { SerializedUserPayload } from '../types';
import { Controller, Post, Session, UseGuards } from '@nestjs/common';

import { LocalAuthGuard } from './guards';
import { GetSerializedUserPayload } from '../decorators';

@Controller('auth/local')
export class LocalAuthController {
  @Post('authenticate')
  @UseGuards(LocalAuthGuard)
  public authenticate(
    @GetSerializedUserPayload() serializedUserPayload: SerializedUserPayload,
  ): SerializedUserPayload {
    return serializedUserPayload;
  }
}
