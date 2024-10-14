import { Task } from '@core/domain/entities/task.entity';
import { TasksRepository } from '@infra/repositories/tasks.repository';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@src/utils/errors';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { CreateTaskDto } from '../dtos/tasks-dtos/create-task-dto';
import { DeleteTaskDto } from '../dtos/tasks-dtos/delete-task-dto';
import { FindByDateDto } from '../dtos/tasks-dtos/find-by-date.dto';
import { taskDto } from '../dtos/tasks-dtos/task-dto';
import { UpdateCompletedTaskDto } from '../dtos/tasks-dtos/update-completed-task';
import { TasksServiceInterface } from '../interfaces/tasks-interfaces/task-service-interface';
import { CreateTaskSchema } from '../validations/tasks-schemas/create-task-schema';

export class TasksService implements TasksServiceInterface {
  constructor(private readonly tasksRepository: TasksRepository) {}

  protected async parseToTask(data: taskDto): Promise<Task> {
    const parse = await CreateTaskSchema.parseAsync({
      endAt: data.endAt ? new Date(data.endAt) : null,
      startAt: new Date(data.startAt),
      repeat: data.repeat,
      name: data.name,
      days: data.days,
      hour: data?.hour || null,
    }).catch((err: any) => ThrowErrorInValidationSchema(err));

    return parse;
  }

  public async create(data: CreateTaskDto, userId: string): Promise<Task> {
    const parse = await this.parseToTask(data);

    const taskToCreate = new Task({ ...parse });
    taskToCreate.userId = userId;

    const task = await this.tasksRepository.save(taskToCreate);

    return task;
  }

  public async findById(taskId: string): Promise<Task> {
    const task = await this.tasksRepository.findById(taskId);
    if (!task) throw new NotFoundException('task não existe!');

    return task;
  }

  public async update(taskId: string, data: Partial<Task>) {
    try {
      const updated = await this.tasksRepository.update(taskId, data);

      return updated;
    } catch (error) {
      throw new BadRequestException('Não foi possível atualizar a task!');
    }
  }

  public async updateArrayCompleted(updateCompletedTaskDto: UpdateCompletedTaskDto): Promise<any> {
    const { completedArray, taskId, userId } = updateCompletedTaskDto;

    const task = await this.findById(taskId);

    if (task.userId !== userId)
      throw new UnauthorizedException('Usuário não pode fazer essa ação!');

    const filterString = completedArray.filter((date: string) => date.toString());
    const updated = await this.update(taskId, { completed: filterString });

    return updated;
  }

  public async findByDate({ startAt, endAt }: FindByDateDto, userId: string): Promise<Task[]> {
    const allTasks = await this.tasksRepository.findByStartAndUser({ startAt, endAt }, userId);

    return allTasks;
  }

  public async deleteTask(data: DeleteTaskDto): Promise<boolean> {
    const { taskId, userId } = data;

    const task = await this.tasksRepository.findById(taskId);

    if (!task?.id) throw new NotFoundException('Task não existe!');

    if (task.userId !== userId)
      throw new UnauthorizedException('Usuário não tem permissão para excluir essa task!');

    await this.tasksRepository.delete(taskId);

    return true;
  }
}
