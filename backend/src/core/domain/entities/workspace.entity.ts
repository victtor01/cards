import { CreateWorkspaceDto } from '@core/application/dtos/create-workspace-dto';
import { randomUUID, UUID } from 'crypto';
import { Column, Entity, JoinColumn, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity('workspaces')
export class Workspace {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'uuid' })
  userId: string;

  @ManyToMany(() => User, (user) => user.workspaces)
  @JoinColumn({ referencedColumnName: 'userId' })
  user: User;

  constructor(props: CreateWorkspaceDto, id?: UUID) {
    Object.assign(this, props);
    this.id = id || randomUUID();
  }
}
