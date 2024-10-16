import { CreateTaskDto } from '@core/application/dtos/tasks-dtos/create-task-dto';
import { DeleteTaskDto } from '@core/application/dtos/tasks-dtos/delete-task-dto';
import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date.dto';
import { taskDto } from '@core/application/dtos/tasks-dtos/task-dto';
import { UpdateCompletedTaskDto } from '@core/application/dtos/tasks-dtos/update-completed-task';
import { TasksServiceInterface } from '@core/application/interfaces/task-service-interface';
import { CreateTaskSchema } from '@core/application/validations/tasks-schemas/create-task-schema';
import { Task } from '@core/domain/entities/task.entity';
import { TasksRepository } from '@infra/repositories/tasks.repository';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@src/utils/errors';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';

export class TasksService implements TasksServiceInterface {
  constructor(private readonly tasksRepository: TasksRepository) {}

  public async parseToTask(data: taskDto): Promise<Task> {
    const parse = await CreateTaskSchema.parseAsync({
      description: data?.description || null,
      hour: data?.hour || null,
      repeat: data.repeat,
      days: data.days,
      name: data.name,
      startAt: new Date(data?.startAt),
      endAt: data.endAt ? new Date(data.endAt) : null,
    }).catch((err: any) => ThrowErrorInValidationSchema(err));

    return parse;
  }

  public async create(data: CreateTaskDto, userId: string): Promise<Task> {
    const parse = await this.parseToTask(data);
    const taskToCreate = new Task({ ...parse, userId });

    const task = await this.tasksRepository.save(taskToCreate);

    return task;
  }

  public async findOneById(taskId: string): Promise<Task> {
    const task = await this.tasksRepository.findById(taskId);

    if (!task?.id) throw new NotFoundException('task não existe!');

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

    const task = await this.findOneById(taskId);

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

  public async findOneByIdAndUserId(taskId: string, userId: string): Promise<Task> {
    const task = await this.findOneById(taskId);

    if (task.userId !== userId) {
      throw new UnauthorizedException('Usuário não tem permissão!');
    }

    return task;
  }
}
