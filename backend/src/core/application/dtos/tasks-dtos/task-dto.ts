import { Day } from '@core/domain/entities/task.entity';
import { RepeatType } from './create-task-dto';

export class TaskDto{
  name: string;
  startAt: Date;
  endAt: Date;
  description: string;
  hour: string;
  days: Day[];
  repeat: RepeatType;

};
