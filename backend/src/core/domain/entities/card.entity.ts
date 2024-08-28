import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import { nanoid } from 'nanoid';
import { CreateCardDto } from '@core/application/dtos/create-card-dto';
import { User } from './user.entity';
import { Workspace } from './workspace.entity';

@Entity({ name: 'cards' })
export class Card {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar', nullable: true })
  title?: string;

  @Column({ type: 'text', nullable: true })
  content: string;

  @Column({ type: 'text', nullable: true })
  background: string;

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User)
  user: string;

  @Column({ type: 'varchar' })
  workspaceId: string;

  @ManyToOne(() => Workspace, (workspace) => workspace.workspaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'workspaceId' })
  workspace: Workspace;

  @CreateDateColumn()
  createdAt: string;

  @UpdateDateColumn()
  updatedAt: string;

  constructor(data: CreateCardDto & { userId: string }, id?: string) {
    this.id = id || nanoid(12);
    Object.assign(this, data);
  }
}
