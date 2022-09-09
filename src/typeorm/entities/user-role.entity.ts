import { Role } from '../../users/roles/eunms';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity("user-roles")
export class UserRole extends BaseEntity {
  @Column()
  userId: number;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @ManyToOne(() => User, (user: User) => user.roles)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  user: User;
}
