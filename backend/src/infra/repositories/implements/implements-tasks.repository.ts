import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date-dto';
import { Task } from '@core/domain/entities/task.entity';
import {
  Between,
  DeleteResult,
  LessThanOrEqual,
  MoreThan,
  Or,
  Repository,
  UpdateResult,
} from 'typeorm';
import { TasksRepository } from '../tasks.repository';

export class ImplementsTasksRepository implements TasksRepository {
  constructor(private readonly tasksRepo: Repository<Task>) {}

  public async save(task: Task): Promise<Task> {
    const created = await this.tasksRepo.save(task);

    return created;
  }

  public async findLates(userId: string, date: Date): Promise<Task[]> {
    const tasks = await this.tasksRepo.find({
      where: {
        userId,
        startAt: LessThanOrEqual(date),
      },
    });

    return tasks;
  }

  public async delete(taskId: string): Promise<DeleteResult> {
    const deleted = await this.tasksRepo.delete(taskId);

    return deleted;
  }

  public async findByStartAndUser(data: FindByDateDto, userId: string): Promise<Task[]> {
    const { startAt, endAt } = data;

    const tasks = await this.tasksRepo.find({
      where: {
        userId: userId,
        startAt: Or(Between(startAt, endAt), LessThanOrEqual(startAt)),
        endAt: Or(Between(startAt, endAt), MoreThan(endAt)),
      },
      order: {
        name: 'DESC',
      },
    });

    return tasks;
  }

  public async update(taskId: string, dataToUpdate: Partial<Task>): Promise<UpdateResult> {
    const updated = await this.tasksRepo.update(taskId, dataToUpdate);

    return updated;
  }

  public async findById(taskId: string): Promise<Task> {
    const task = await this.tasksRepo.findOneBy({ id: taskId });

    return task;
  }
}
