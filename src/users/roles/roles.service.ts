import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { UserRole } from '../../typeorm/entities';
import { Repository } from 'typeorm';

@Injectable()
export class RolesService {
  public constructor(
    @InjectRepository(UserRole)
    public readonly repo: Repository<UserRole>,
  ) {}
}
