import { Day } from '@core/domain/entities/task.entity';
import { IsArray, IsString } from 'class-validator';

export class CreateTaskDto {
  @IsString()
  name: string;

  @IsString()
  description: string | null;
  
  @IsString()
  endAt: Date | string;
  
  @IsString()
  startAt: string | Date;
  
  @IsString()
  hour: string;

  @IsArray()
  days: Day[];

  @IsString()
  color: string;
  
  repeat: RepeatType;
}

export type RepeatType = 'weekly' | null;
