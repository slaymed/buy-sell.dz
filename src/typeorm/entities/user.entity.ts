import { CreateUserDto } from '../../users/dto';
import { Exclude } from 'class-transformer';
import { Column, Entity, Index, OneToMany, OneToOne } from 'typeorm';
import { UserType } from '../../users/enums';
import { BaseEntity } from './base.entity';
import { IdentityFile } from './identity-file.entity';
import { UserIdentificationStatus } from '../../users/identity-files/enum';
import { UserRole } from './user-role.entity';

@Entity('users')
export class User extends BaseEntity {
  public constructor(createUserDto: CreateUserDto) {
    super();
    Object.assign(this, createUserDto);
  }

  @Column({ default: '' })
  public firstName?: string;

  @Column({ default: '' })
  public lastName?: string;

  @Exclude()
  @Index()
  @Column({ unique: true })
  public email: string;

  @Exclude()
  @Column()
  public password: string;

  @Exclude()
  @Column({ type: 'enum', enum: UserType, default: UserType.LOCAL })
  public from: UserType;

  @OneToMany(() => UserRole, (userRole: UserRole) => userRole.user)
  public roles: Array<UserRole>;

  @Column({
    type: 'enum',
    enum: UserIdentificationStatus,
    default: UserIdentificationStatus.WAITING_FOR_UPLOAD,
  })
  public identificationStatus: UserIdentificationStatus;

  @OneToMany(
    () => IdentityFile,
    (identityFile: IdentityFile) => identityFile.user,
  )
  public identityFiles: Array<IdentityFile>;
}
