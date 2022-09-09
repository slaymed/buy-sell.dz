import { UsersService } from '../../users/users.service';
import { User } from '../../typeorm/entities';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { SerializedUserPayload } from '../types';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  public constructor(private readonly usersService: UsersService) {
    super();
  }

  public serializeUser(
    { email, from }: SerializedUserPayload,
    done: (err: Error, payload: SerializedUserPayload) => void,
  ) {
    done(null, { email, from });
  }

  public async deserializeUser(
    serializedUserPayload: SerializedUserPayload,
    done: (err: Error, payload: User) => void,
  ) {
    const user = await this.usersService.repo.findOneBy(serializedUserPayload);
    done(!user ? new UnauthorizedException() : null, user);
  }
}
