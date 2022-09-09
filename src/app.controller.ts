import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Roles } from './users/roles/decorators';
import { Role } from './users/roles/eunms';

@Controller()
export class AppController {
  public constructor(private readonly appService: AppService) {}

  @Get()
  @Roles(Role.USER)
  public getHello(): string {
    return this.appService.getHello();
  }
}
