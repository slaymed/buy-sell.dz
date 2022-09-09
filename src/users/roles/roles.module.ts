import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRole } from '../../typeorm/entities';
import { RolesGuard } from './guards';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole])],
  controllers: [RolesController],
  providers: [RolesService, { provide: APP_GUARD, useClass: RolesGuard }],
  exports: [RolesService],
})
export class RolesModule {}
