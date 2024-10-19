import { Day } from '@core/domain/entities/task.entity';

export interface CreateTaskDto {
  name: string;
  description: string | null;
  endAt: Date | string;
  startAt: string | Date;
  hour: string;
  days: Day[];
  repeat: RepeatType;
}

export type RepeatType = 'weekly' | false;
