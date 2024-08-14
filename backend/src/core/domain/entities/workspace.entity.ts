import { CreateWorkspaceDto } from '@core/application/dtos/create-workspace-dto';
import { randomUUID, UUID } from 'crypto';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { nanoid } from 'nanoid';
import { Card } from './card.entity';

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

  @ManyToOne(() => User, (user) => user.workspaces)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column({ type: 'uuid', nullable: true })
  public parentId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.workspaces, {
    nullable: true,
  })
  @JoinColumn({ name: 'parentId' })
  public parent: Workspace;

  @OneToMany(() => Workspace, (workspace) => workspace.parent)
  public workspaces: Workspace[];

  @OneToMany(() => Card, (card) => card.workspace)
  cards: Card[];

  constructor(props: CreateWorkspaceDto, id?: UUID) {
    Object.assign(this, props);
    this.code = nanoid(12);
    this.id = id || randomUUID();
  }
}
