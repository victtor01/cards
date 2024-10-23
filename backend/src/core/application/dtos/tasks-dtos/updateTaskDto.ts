import { Day } from '@core/domain/entities/task.entity';
import { IsArray, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { RepeatType } from './create-task-dto';

export class UpdateTaskDto {
  constructor(props: UpdateTaskDto) {
    Object.assign(this, props);
  }

  @IsString()
  public id: string;

  @IsString()
  @MinLength(1)
  public name: string;

  @IsString()
  public description: string;

  @IsIn(['weekly', false])
  public repeat: RepeatType = 'weekly';

  @IsString()
  public startAt: Date | string;

  @IsString()
  @IsOptional()
  public endAt: Date | string;

  @IsArray()
  public days: Day[];

  @IsString()
  @IsOptional()
  public hour: string | null = null;
}
