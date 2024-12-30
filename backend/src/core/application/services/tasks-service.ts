import { CreateTaskDto } from '@core/application/dtos/tasks-dtos/create-task-dto';
import { DeleteTaskDto } from '@core/application/dtos/tasks-dtos/delete-task-dto';
import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date-dto';
import { UpdateCompletedTaskDto } from '@core/application/dtos/tasks-dtos/update-completed-task';
import { TasksServiceInterface } from '@core/application/interfaces/task-service-interface';
import { CreateTaskSchema } from '@core/application/validations/tasks-schemas/create-task-schema';
import { Task } from '@core/domain/entities/task.entity';
import { TasksRepository } from '@infra/repositories/tasks.repository';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@src/utils/errors';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { validateOrReject } from 'class-validator';
import { UUID } from 'crypto';
import dayjs, { Dayjs } from 'dayjs';
import { UpdateTaskDto } from '../dtos/tasks-dtos/update-task-dto';

type OverdueTask = { id: UUID | string; name: string; date: string };

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

  private createDaysWithTasks(tasks: Task[], arrayOfDays: Dayjs[]) {
    const tasksWithDays = Object.fromEntries(
      arrayOfDays.map((day) => [day.format('YYYY-MM-DD'), []])
    );
  
    arrayOfDays.forEach((date) => {
      tasks.forEach((task) => {
        if (this.taskPertencesToday(task, date)) {
          tasksWithDays[date.format('YYYY-MM-DD')].push(task);
        }
      });
    });
  
    return tasksWithDays;
  }

  public async findByDate({ startAt, endAt }: FindByDateDto, userId: string): Promise<any> {
    const allTasks = await this.tasksRepository.findByStartAndUser({ startAt, endAt }, userId);
    const endAtToCreate = endAt || dayjs(startAt).endOf('week').toDate();
    const days = this.createArrayFromDateToDate(dayjs(startAt), dayjs(endAtToCreate));
    var createdArray = this.createDaysWithTasks(allTasks, days);
    return createdArray;
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
    const taskToUpdate = { ...task, ...updateTaskDto };

    if (task?.userId !== userId) {
      throw new UnauthorizedException('usuário não tem permissão!');
    }

    taskToUpdate.completed = updateTaskDto?.days?.every(
      (value, index) => value?.toString() === task?.days[index]?.toString()
    )
      ? task.completed
      : [];

    await this.tasksRepository.update(task.id, taskToUpdate);

    return true;
  }

  public getOldestTaskDate(tasks: Task[]): string | Date {
    const oldestStart = tasks.reduce((oldestTask, task) => {
      const currentTaskDate = new Date(task.startAt);
      const oldestDate = new Date(oldestTask.startAt);
      return currentTaskDate < oldestDate ? task : oldestTask;
    }, tasks[0])?.startAt;
    return oldestStart;
  }

  private isTaskInfinite(task: Task): boolean {
    return task.repeat === 'weekly' && !task.endAt;
  }

  private isCurrentDateIsAfterOrSame(currentDate: Dayjs, taskStartAt: Dayjs): boolean {
    return currentDate.isAfter(taskStartAt) || currentDate.isSame(taskStartAt);
  }

  private createArrayFromDateToDate(startAt: Dayjs, endAt: Dayjs) {
    return Array.from({ length: endAt.diff(startAt, 'day') + 1 }, (_, i) => startAt.add(i, 'day'));
  }

  private isValidTaskForDate(task: Task, currentDate: Dayjs): Task | null {
    const taskStartAt = dayjs(task.startAt);
    
    // Verifica se a data atual é depois ou igual ao início da tarefa
    if (!this.isCurrentDateIsAfterOrSame(currentDate, taskStartAt)) return null;
  
    // Verifica se a tarefa é infinita
    if (this.isTaskInfinite(task)) return task;
  
    // Verifica o fim da tarefa
    const taskEndAt = task.endAt ? dayjs(task.endAt) : dayjs(task.startAt).endOf('week');
    if (currentDate.isBefore(taskEndAt, 'day') || currentDate.isSame(taskEndAt, 'day')) {
      return task;
    }
  
    return null;
  }

  public taskPertencesToday(task: Task, currentDate: Dayjs) {
    const { days } = task;
    const daysString = days.map((day) => day.toString());
  
    // Verifica se a tarefa pertence ao dia
    if (!daysString.includes(currentDate.day().toString())) return null;
  
    return this.isValidTaskForDate(task, currentDate);
  }

  public isTaskDueTodayLates(task: Task, currentDate: Dayjs): Task | null {
    const dayOfWeek = currentDate.day();
    const taskDays = task?.days?.map(Number);
    const currentDateFormatted = currentDate.format('YYYY-MM-DD');
    const taskIsCompleted = task?.completed?.includes(currentDateFormatted);
  
    // Verifica se a tarefa pertence ao dia e não está completa
    if (!taskDays?.includes(dayOfWeek) || taskIsCompleted) return null;
  
    return this.isValidTaskForDate(task, currentDate);
  }

  private processNonRepeatingTask(task: Task, endDate: Dayjs) {
    const { id, startAt, days, completed, name } = task;

    const overdue: OverdueTask[] = [];
    const dateStartAt = dayjs(startAt);
    const daysIndex = days.map(Number);
    const isSameWeek = endDate.startOf('week').isSame(startAt);
    const arrayOfDays = isSameWeek
      ? Array.from({ length: endDate.day() }, (_, i) => i)
      : Array.from({ length: 7 }, (_, i) => i);

    arrayOfDays.forEach((indexDay: number) => {
      const formattedDate = dateStartAt.set('day', indexDay).format('YYYY-MM-DD');
      const dayIndexIncludes = daysIndex.includes(indexDay);
      const completedDay = completed?.includes(formattedDate);

      if (dayIndexIncludes && !completedDay) {
        overdue.push({ id, name, date: formattedDate.toString() });
      }
    });

    return overdue;
  }

  public async findLates(userId: string, dateString?: string): Promise<any[]> {
    const date = dateString ? new Date(dateString) : dayjs().toDate();
    const allTasksBeforeDay = await this.tasksRepository.findLates(userId, date);
    if (!allTasksBeforeDay) return [];

    try {
      const overdueTasks: OverdueTask[] = [];
      const oldestStart = this.getOldestTaskDate(allTasksBeforeDay);
      const startDate = dayjs(oldestStart);
      const endDate = dayjs(date);

      const tasksNotRepeat = allTasksBeforeDay?.filter((task) => task.repeat === null) || [];
      tasksNotRepeat?.forEach((taskNotRepeat) => {
        const process = this.processNonRepeatingTask(taskNotRepeat, endDate);
        overdueTasks.push(...process);
      });

      const datesArray = this.createArrayFromDateToDate(startDate, endDate);
      const tasksRepeat = allTasksBeforeDay?.filter((task) => task.repeat === 'weekly') || [];
      const overdueRepeatTasks = datesArray.flatMap((currentDate) =>
        tasksRepeat
          .map((task) => this.isTaskDueTodayLates(task, currentDate))
          .filter((repeatedTask) => !!repeatedTask)
          .map(({ id, name }) => ({ id, name, date: currentDate.format('YYYY-MM-DD') }))
      );

      overdueTasks.push(...overdueRepeatTasks);

      return overdueTasks;
    } catch (error) {
      throw new BadRequestException('Houve um erro ao tentar buscar as tasks atrasadas!');
    }
  }
}
