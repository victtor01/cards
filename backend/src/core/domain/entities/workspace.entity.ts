import { CreateWorkspaceDto } from '@core/application/dtos/workspaces-dtos/create-workspace-dto';
import { nanoid } from 'nanoid';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { Card } from './card.entity';
import { User } from './user.entity';

export enum WorkspaceStatus {
  DISABLED = 'disabled',
  ACTIVATED = 'activated',
}

@Entity('workspaces')
export class Workspace {
  @PrimaryColumn({ type: 'varchar' })
  public id: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'enum', enum: WorkspaceStatus, default: WorkspaceStatus.ACTIVATED })
  public status: WorkspaceStatus;

  @Column({ type: 'uuid' })
  public userId: string;

  @Column({ type: 'varchar', length: 12, unique: true })
  public code: string;

  @Column({ type: 'varchar', nullable: true })
  public parentId: string = null;

  @Column({ type: 'varchar', nullable: true })
  public background: string;

  @ManyToOne(() => User, (user) => user.workspaces)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @ManyToOne(() => Workspace, (workspace) => workspace.workspaces, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parentId' })
  public parent: Workspace;

  @OneToMany(() => Workspace, (workspace) => workspace.parent, {
    onDelete: 'CASCADE',
  })
  public workspaces: Workspace[];

  @OneToMany(() => Card, (card) => card.workspace)
  cards: Card[];

  constructor(props: CreateWorkspaceDto, id?: string) {
    Object.assign(this, props);
    this.code = nanoid(12);
    this.id = id || nanoid(12);
  }
}
