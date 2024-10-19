import { CreateTaskDto } from '@core/application/dtos/tasks-dtos/create-task-dto';
import { DeleteTaskDto } from '@core/application/dtos/tasks-dtos/delete-task-dto';
import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date.dto';
import { UpdateCompletedTaskDto } from '@core/application/dtos/tasks-dtos/update-completed-task';
import { Task } from '@core/domain/entities/task.entity';
import { TaskDto } from '../dtos/tasks-dtos/task-dto';

export abstract class TasksServiceInterface {
  abstract create(data: CreateTaskDto, userId: string): Promise<Task>;
  abstract parseToTask(data: TaskDto): Promise<Task>
  abstract findOneById(taskId: string): Promise<Task>;
  abstract findByDate(data: FindByDateDto, userId: string): Promise<Task[]>;
  abstract updateArrayCompleted(data: UpdateCompletedTaskDto): Promise<any>;
  abstract deleteTask(data: DeleteTaskDto): Promise<boolean>;
  abstract findOneByIdAndUserId(taskId: string, userId: string): Promise<Task>;
}
