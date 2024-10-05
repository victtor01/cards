import { Task } from '@core/domain/entities/task.entity';
import { TasksRepository } from '@infra/repositories/tasks.repository';
import { UnauthorizedException } from '@src/utils/errors';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { CreateTaskDto } from '../dtos/tasks-dtos/create-task-dto';
import { FindByDateDto } from '../dtos/tasks-dtos/find-by-date.dto';
import { UpdateCompletedTask } from '../dtos/tasks-dtos/update-completed-task';
import { TasksServiceInterface } from '../interfaces/tasks-interfaces/task-service-interface';
import { CreateTaskSchema } from '../validations/tasks-schemas/create-task-schema';

export class TasksService implements TasksServiceInterface {
  constructor(private readonly tasksRepository: TasksRepository) {}

  public async create(data: CreateTaskDto, userId: string): Promise<Task> {
    const { name, startAt, endAt, repeat, days, hour } = data;

    const parse = await CreateTaskSchema.parseAsync({
      endAt: endAt ? new Date(endAt) : null,
      startAt: new Date(startAt),
      repeat,
      hour,
      name,
      days,
    }).catch((err: any) => ThrowErrorInValidationSchema(err));

    const taskToCreate = new Task({ ...parse });
    taskToCreate.userId = userId;
    const task = await this.tasksRepository.save(taskToCreate);

    return task;
  }

  public async updateArrayCompleted(updateCompletedTaskDto: UpdateCompletedTask): Promise<any> {
    const { completedArray, taskId, userId } = updateCompletedTaskDto;

    const filterString = completedArray.filter((completedDateString: string) =>
      completedDateString.toString()
    );

    const task = await this.tasksRepository.findById(taskId);

    if (task.userId !== userId) {
      throw new UnauthorizedException('Usuário não pode fazer essa ação!');
    }

    const updated = await this.tasksRepository.update(taskId, {
      completed: filterString,
    });

    return updated;
  }

  public async findByDate({ startAt, endAt }: FindByDateDto, userId: string): Promise<Task[]> {
    const allTasks = await this.tasksRepository.findByStartAndUser({ startAt, endAt }, userId);

    return allTasks;
  }
}
