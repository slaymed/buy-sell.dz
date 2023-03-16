import { Exclude, Expose } from 'class-transformer';
import { AllowedIdentityFileRef } from 'src/users/identity-files/types';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { BaseEntity } from './base.entity';
import { User } from './user.entity';

@Entity('identity-files')
export class IdentityFile extends BaseEntity {
  @Column()
  public referenceColumn: AllowedIdentityFileRef;

  @Exclude()
  @Column()
  public userId: number;

  @Exclude()
  @Column()
  public urn: string;

  @Column()
  public url: string;

  @ManyToOne(() => User, (user: User) => user.identityFiles)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  public user: User;
}
