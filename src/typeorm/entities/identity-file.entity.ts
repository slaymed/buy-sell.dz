import { Expose } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('identity-files')
export class IdentityFile extends BaseEntity {
  @Column()
  public referenceColumn: string;

  @Column()
  public userId: number;

  @Column()
  public urn: string;

  @Column()
  public url: string;

  @ManyToOne(() => User, (user: User) => user.identityFiles)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user: User;
}
