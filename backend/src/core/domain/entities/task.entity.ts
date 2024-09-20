import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'task' })
export class Task {
  @PrimaryColumn({ type: 'varchar' })
  id: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'date', nullable: true })
  startAt: Date;

  @Column({ type: 'date', nullable: true })
  endAt: Date;

  @Column({ type: 'simple-array' })
  completed: string[];

  @Column({ type: 'simple-array' })
  deleted: string[];
}
