import { CreateTaskDto } from '@core/application/dtos/tasks-dtos/create-task-dto';
import { DeleteTaskDto } from '@core/application/dtos/tasks-dtos/delete-task-dto';
import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date-dto';
import { UpdateCompletedTaskDto } from '@core/application/dtos/tasks-dtos/update-completed-task';
import { Task } from '@core/domain/entities/task.entity';
import { UpdateTaskDto } from '../dtos/tasks-dtos/update-task-dto';

export abstract class TasksServiceInterface {
  abstract findOneByIdAndUserId(taskId: string, userId: string): Promise<Task>;
  abstract findByDate(data: FindByDateDto, userId: string): Promise<Task[]>;
  abstract updateArrayCompleted(data: UpdateCompletedTaskDto): Promise<any>;
  abstract updateTask(data: UpdateTaskDto, userId: string): Promise<boolean>;
  abstract create(data: CreateTaskDto, userId: string): Promise<Task>;
  abstract findLates(userId: string, date?: string): Promise<Task[]>;
  abstract deleteTask(data: DeleteTaskDto): Promise<boolean>;
  abstract parseToTask(data: Task): Promise<Task>;
}
