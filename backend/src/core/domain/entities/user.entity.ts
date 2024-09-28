import { CreateUserDto } from '@core/application/dtos/users-dtos/create-user-dto';
import { randomUUID, UUID } from 'crypto';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserInterface } from '../interfaces/user-entity.interface';
import { Task } from './task.entity';
import { Workspace } from './workspace.entity';

@Entity({ name: 'users' })
export class User implements UserInterface {
  @PrimaryGeneratedColumn('uuid')
  public id: UUID;

  @Column({ type: 'varchar', length: 100 })
  public firstName: string;

  @Column({ type: 'varchar', length: 100 })
  public lastName: string;

  @Column({ type: 'varchar', length: 100 })
  public email: string;

  @Column({ type: 'varchar', length: 100 })
  public password: string;

  @Column({ type: 'varchar', nullable: true })
  public photo: string;

  @OneToMany(() => Workspace, (workspaces) => workspaces.user)
  workspaces: Workspace[];

  @OneToMany(() => Task, (task) => task.user)
  tasks: Task[]

  constructor(props: CreateUserDto, id?: UUID) {
    Object.assign(this, props);
    this.id = id || randomUUID();
  }
}
