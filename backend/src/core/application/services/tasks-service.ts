import { CreateTaskDto } from '@core/application/dtos/tasks-dtos/create-task-dto';
import { DeleteTaskDto } from '@core/application/dtos/tasks-dtos/delete-task-dto';
import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date.dto';
import { UpdateCompletedTaskDto } from '@core/application/dtos/tasks-dtos/update-completed-task';
import { TasksServiceInterface } from '@core/application/interfaces/task-service-interface';
import { CreateTaskSchema } from '@core/application/validations/tasks-schemas/create-task-schema';
import { Task } from '@core/domain/entities/task.entity';
import { TasksRepository } from '@infra/repositories/tasks.repository';
import { NotFoundException, UnauthorizedException } from '@src/utils/errors';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { validateOrReject } from 'class-validator';
import { UpdateTaskDto } from '../dtos/tasks-dtos/updateTaskDto';

export class TasksService implements TasksServiceInterface {
  constructor(private readonly tasksRepository: TasksRepository) {}

  public async parseToTask(data: CreateTaskDto): Promise<Task> {
    const parse = await CreateTaskSchema.parseAsync({
      description: data?.description || null,
      hour: data?.hour || null,
      repeat: data.repeat,
      days: data.days,
      name: data.name,
      startAt: data.startAt,
      endAt: data.endAt,
    }).catch((err: any) => ThrowErrorInValidationSchema(err));

    return parse;
  }

  public async create(data: CreateTaskDto, userId: string): Promise<Task> {
    const parse = await this.parseToTask(data);
    const taskToCreate = new Task({ ...parse, userId });
    const task = await this.tasksRepository.save(taskToCreate);

    return task;
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

  public async findOneById(taskId: string): Promise<Task> {
    const task = await this.tasksRepository.findById(taskId);
    if (!task?.id) throw new NotFoundException('task não existe!');

    return task;
  }

  public async updateArrayCompleted(updateCompletedTaskDto: UpdateCompletedTaskDto): Promise<any> {
    const { completedArray, taskId, userId } = updateCompletedTaskDto;
    const task = await this.findOneById(taskId);

    if (task.userId !== userId)
      throw new UnauthorizedException('Usuário não pode fazer essa ação!');

    const filterString = completedArray.filter((date: string) => date.toString());
    const updated = await this.tasksRepository.update(taskId, { completed: filterString });

    return updated;
  }

  public async findOneByIdAndUserId(taskId: string, userId: string): Promise<Task> {
    const task = await this.findOneById(taskId);

    if (task.userId !== userId) {
      throw new UnauthorizedException('Usuário não tem permissão!');
    }

    return task;
  }

  public async updateTask(updateTaskDto: UpdateTaskDto, userId: string): Promise<boolean> {
    const validation = new UpdateTaskDto(updateTaskDto);
    await validateOrReject(validation);

    const task = await this.tasksRepository.findById(updateTaskDto.id);
    if (task?.userId !== userId) throw new UnauthorizedException('usuário não tem permissão!');

    await this.tasksRepository.update(task.id, { ...task, ...updateTaskDto })

    return true;
  }
}
