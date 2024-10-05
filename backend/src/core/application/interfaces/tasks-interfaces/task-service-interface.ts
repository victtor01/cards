import { CreateTaskDto } from '@core/application/dtos/tasks-dtos/create-task-dto';
import { UpdateCompletedTask } from '@core/application/dtos/tasks-dtos/update-completed-task';
import { Task } from '@core/domain/entities/task.entity';

export abstract class TasksServiceInterface {
  abstract create(data: CreateTaskDto, userId: string): Promise<Task>;
  abstract findByDate(data: any, userId: string): Promise<Task[]>;
  abstract updateArrayCompleted(data: UpdateCompletedTask): Promise<any>;
}
