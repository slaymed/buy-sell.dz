import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';

import { User } from '../typeorm/entities';
import { GetUser } from '../users/decorators';
import { UsersService } from '../users/users.service';
import { AuthenticatedGuard } from './guards';

@Controller('auth')
export class AuthController {
  public constructor(private readonly usersService: UsersService) {}

  @Get('signout')
  @UseGuards(AuthenticatedGuard)
  public logout(@Req() req: Request) {
    req.session.destroy((error) => {});
    return { message: 'Sign Out Success' };
  }

  @Get('me')
  @UseGuards(AuthenticatedGuard)
  public me(@GetUser() user: User) {
    return this.usersService.getUserWithRoles(user.id);
  }
}
