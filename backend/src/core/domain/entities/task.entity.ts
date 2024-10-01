import { CreateTaskDto, RepeatType } from '@core/application/dtos/tasks-dtos/create-task-dto';
import { randomUUID } from 'crypto';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import { User } from './user.entity';

export type Day = 0 | 1 | 2 | 3 | 4 | 5 | 6;

@Entity({ name: 'tasks' })
export class Task {
  @PrimaryColumn({ type: 'varchar' })
  public id: string;

  @Column({ type: 'varchar' })
  public name: string;

  @Column({ type: 'varchar' })
  public repeat: RepeatType;

  @Column({ type: 'timestamp' })
  public startAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  public endAt: Date;

  @Column({ type: 'simple-array', nullable: true })
  public completed: string[];

  @Column({ type: 'simple-array', nullable: true })
  public deleted: string[];

  @Column({ type: 'simple-array' })
  public days: Day[];

  @Column({ type: 'varchar' })
  userId: string;

  @ManyToOne(() => User, (user) => user.tasks)
  @JoinColumn({ name: 'userId' })
  user: User;

  constructor(props?: CreateTaskDto, id?: string) {
    Object.assign(this, props);
    this.startAt = props?.startAt || new Date();
    this.endAt = props?.endAt ? new Date(props.endAt) : null;
    this.id = id || randomUUID();
  }
}
