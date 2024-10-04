import { Day } from '@core/domain/entities/task.entity';

export interface CreateTaskDto {
  name: string;
  startAt: Date;
  endAt: Date;
  hour: string;
  days: Day[];
  repeat: RepeatType;
}

export type RepeatType = 'weekly' | false;
