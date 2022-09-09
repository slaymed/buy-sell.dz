import { ISession } from 'connect-typeorm/out';
import {
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('session-store')
export class SessionStore implements ISession {
  @Index()
  @Column('bigint')
  public expiredAt = Date.now();

  @PrimaryColumn('varchar', { length: 255, default: '' })
  public id: string;

  @Column({ type: 'text', default: '' })
  public json: string;

  @DeleteDateColumn({ nullable: true })
  public destroyedAt?: Date;
}
