import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date-dto';
import { Task } from '@core/domain/entities/task.entity';
import {
    And,
    DeleteResult,
    IsNull,
    LessThanOrEqual,
    MoreThan,
    MoreThanOrEqual,
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
      where: [
        {
          userId,
          startAt: MoreThanOrEqual(startAt),
          endAt: MoreThan(endAt),
          repeat: IsNull(),
        },
        {
          userId,
          startAt: LessThanOrEqual(endAt),
          endAt: MoreThan(startAt),
          repeat: IsNull(),
        },
        {
          userId,
          startAt: LessThanOrEqual(startAt),
          endAt: MoreThan(startAt),
          repeat: IsNull(),
        },
        {
          userId,
          startAt: LessThanOrEqual(endAt),
          repeat: 'weekly',
          endAt: IsNull(),
        },
        {
          userId,
          startAt: LessThanOrEqual(endAt),
          repeat: 'weekly',
          endAt: MoreThan(startAt),
        },
        {
          userId,
          startAt: And(MoreThanOrEqual(startAt), LessThanOrEqual(endAt)),
          repeat: IsNull(),
          endAt: IsNull(),
        },
      ],
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
