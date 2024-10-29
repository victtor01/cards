import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date-dto';
import { Task } from '@core/domain/entities/task.entity';
import { DeleteResult, UpdateResult } from 'typeorm';

export abstract class TasksRepository {
  abstract save(task: Task): Promise<Task>;
  abstract delete(taskId: string): Promise<DeleteResult>
  abstract findById(taskId: string): Promise<Task>;
  abstract update(taskId: string, dataToUpdate: Partial<Task>): Promise<UpdateResult>;
  abstract findByStartAndUser(data: FindByDateDto, userId: string): Promise<Task[]>;
}
