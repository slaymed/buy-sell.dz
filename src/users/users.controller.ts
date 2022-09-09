import { AuthenticatedGuard } from '../auth/guards';
import { User } from '../typeorm/entities/user.entity';
import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GetUser } from './decorators';
import { Roles } from './roles/decorators';
import { Role } from './roles/eunms';
import { IdentifyUserDto } from './dto';

@Controller('users')
export class UsersController {
  public constructor(private readonly usersService: UsersService) {}

  @Get()
  // @UseGuards(AuthenticatedGuard)
  public getAllUsers() {
    return this.usersService.repo.find();
  }

  @Post('submit-for-identification')
  @UseGuards(AuthenticatedGuard)
  public async submitforIdentification(@GetUser() user: User): Promise<User> {
    return this.usersService.submitForIdentification(user);
  }

  @Post('identify-user')
  @UseGuards(AuthenticatedGuard)
  @Roles(Role.ADMIN)
  public identifyUser(@Body() identifyUserDto: IdentifyUserDto) {
    return this.usersService.identifyUser(identifyUserDto);
  }
}
