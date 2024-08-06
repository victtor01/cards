import { CreateWorkspaceDto } from '@core/application/dtos/create-workspace-dto';
import { randomUUID, UUID } from 'crypto';
import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { nanoid } from 'nanoid';
import { type } from 'os';
import { nullable } from 'zod';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  public id: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'uuid' })
  public userId: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  public code: string;

  @ManyToMany(() => User, (user) => user.workspaces)
  @JoinColumn({ referencedColumnName: 'userId' })
  public user: User;

  constructor(props: CreateWorkspaceDto, id?: UUID) {
    Object.assign(this, props);
    this.code = nanoid(12);
    this.id = id || randomUUID();
  }
}
