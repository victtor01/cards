import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date.dto';
import { Task } from '@core/domain/entities/task.entity';

export abstract class TasksRepository {
  abstract save(task: Task): Promise<Task>;
  abstract findByStartAndUser(data: FindByDateDto, userId: string): Promise<Task[]>;
}
