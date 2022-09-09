import { Controller, Get, Session, UseGuards } from '@nestjs/common';

import { User } from '../typeorm/entities';
import { GetUser } from '../users/decorators';
import { UsersService } from '../users/users.service';
import { AuthenticatedGuard } from './guards';

@Controller('auth')
export class AuthController {
  public constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  public me(@GetUser() user: User) {
    return this.usersService.getUserWithRoles(user.id);
  }
}
