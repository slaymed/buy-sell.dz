import { User } from '../typeorm/entities';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdentityFilesModule } from './identity-files/identity-files.module';
import { RolesModule } from './roles/roles.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), IdentityFilesModule, RolesModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
