import { CreateTaskDto } from '@core/application/dtos/tasks-dtos/create-task-dto';
import { DeleteTaskDto } from '@core/application/dtos/tasks-dtos/delete-task-dto';
import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date-dto';
import { UpdateCompletedTaskDto } from '@core/application/dtos/tasks-dtos/update-completed-task';
import { TasksServiceInterface } from '@core/application/interfaces/task-service-interface';
import { CreateTaskSchema } from '@core/application/validations/tasks-schemas/create-task-schema';
import { Task } from '@core/domain/entities/task.entity';
import { TasksRepository } from '@infra/repositories/tasks.repository';
import { NotFoundException, UnauthorizedException } from '@src/utils/errors';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { validateOrReject } from 'class-validator';
import { UUID } from 'crypto';
import dayjs, { Dayjs } from 'dayjs';
import { UpdateTaskDto } from '../dtos/tasks-dtos/update-task-dto';

export class TasksService implements TasksServiceInterface {
  constructor(private readonly tasksRepository: TasksRepository) {}

  protected async findOneById(taskId: string): Promise<Task> {
    const task = await this.tasksRepository.findById(taskId);
    if (!task?.id) throw new NotFoundException('task não existe!');
    return task;
  }

  public async parseToTask(data: CreateTaskDto): Promise<Task> {
    const parse = await CreateTaskSchema.parseAsync({
      description: data?.description || null,
      hour: data?.hour || null,
      repeat: data.repeat,
      color: data.color,
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

    const task = await this.findOneById(validation.id);

    if (task?.userId !== userId) {
      throw new UnauthorizedException('usuário não tem permissão!');
    }

    await this.tasksRepository.update(task.id, { ...task, ...updateTaskDto, completed: [] });

    return true;
  }

  public GetOldestTask(tasks: Task[]): string | Date {
    const oldestStart = tasks.reduce((oldestTask, task) => {
      const currentTaskDate = new Date(task.startAt);
      const oldestDate = new Date(oldestTask.startAt);
      return currentTaskDate < oldestDate ? task : oldestTask;
    }, tasks[0])?.startAt;

    return oldestStart;
  }

  public isDateOverdue(currentDay: Dayjs, taskEndAt?: Dayjs | undefined): boolean {
    return !taskEndAt || currentDay.isBefore(taskEndAt, 'day');
  }

  public checkRepeatTask(task: Task, currentDate: Dayjs): Task | null {
    const dayOfWeek = currentDate.day();

    const taskDays = task?.days?.map(Number);
    const taskStartAt = dayjs(task.startAt);
    const taskEndAt = task.endAt ? dayjs(task.endAt) : undefined;

    const completedArrayIncludesDate = task.completed?.includes(currentDate.format('YYYY-MM-DD'));
    if (completedArrayIncludesDate) {
      return null;
    }

    const currentDateIsSameStartAtTask =
      !currentDate.isAfter(taskStartAt) && !currentDate.isSame(taskStartAt);
    if (currentDateIsSameStartAtTask) {
      return null;
    }

    if (taskDays?.includes(dayOfWeek) && this.isDateOverdue(currentDate, taskEndAt)) {
      return task;
    }

    return null;
  }

  public async findLates(userId: string, dateString?: string): Promise<any[]> {
    const date = dateString ? new Date(dateString) : dayjs().toDate();
    const allTasksBeforeDay = await this.tasksRepository.findLates(userId, date);

    if (!allTasksBeforeDay) return [];

    const tasksNotRepeat = allTasksBeforeDay?.filter((task) => task.repeat === null) || [];
    const tasksRepeat = allTasksBeforeDay?.filter((task) => task.repeat === 'weekly') || [];
    const oldestStart = this.GetOldestTask(allTasksBeforeDay);
    const startDate = dayjs(oldestStart);
    const endDate = dayjs(date);

    const datesArray = Array.from({ length: endDate.diff(startDate, 'day') + 1 }, (_, i) =>
      startDate.add(i, 'day')
    );

    const overdueTasks: { id: UUID | string; name: string; date: string }[] = [];

    tasksNotRepeat?.forEach((taskNotRepeat) => {
      const { id, startAt, days, completed, name } = taskNotRepeat;
      const date = dayjs(startAt);
      const daysIndex = days.map(Number);
      const isSameWeek = endDate.startOf('week').isSame(startAt);
      const arrayOfDays = isSameWeek
        ? Array.from({ length: endDate.day() }, (_, i) => i)
        : Array.from({ length: 7 }, (_, i) => i);

      arrayOfDays.forEach((indexDay: number) => {
        const formattedDate = date.set('day', indexDay).format('YYYY-MM-DD');
        const dayIndexIncludes = daysIndex.includes(indexDay);
        const completedDay = completed?.includes(formattedDate);
        if (dayIndexIncludes && !completedDay) {
          overdueTasks.push({ id, name, date: formattedDate.toString() });
        }
      });
    });

    const overdueRepeatTasks = datesArray.flatMap((currentDate) =>
      tasksRepeat
        .map((task) => this.checkRepeatTask(task, currentDate))
        .filter((repeatedTask) => repeatedTask)
        .map(({ id, name }) => ({ id, name, date: currentDate.format('YYYY-MM-DD') }))
    );

    overdueTasks.push(...overdueRepeatTasks);

    return overdueTasks;
  }
}
