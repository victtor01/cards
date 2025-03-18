import { FindByDateDto } from '@core/application/dtos/tasks-dtos/find-by-date-dto';
import { UpdateTaskDto } from '@core/application/dtos/tasks-dtos/update-task-dto';
import { TasksServiceInterface } from '@core/application/interfaces/task-service-interface';
import { STATUS } from '@infra/config/constants/status';
import { BadRequestException } from '@src/utils/errors';
import { Request, Response } from 'express';

export class TasksController {
  constructor(private readonly tasksService: TasksServiceInterface) {}

  public async create(req: Request, res: Response) {
    const { body } = req;
    const { id } = req.session;
    const created = await this.tasksService.create(body, id);

    return res.status(STATUS.CREATED).json(created);
  }

  public async findOneByIdAndUser(request: Request, response: Response) {
    const { session, params } = request;
    const [taskId, userId] = [params.taskId, session.id];
    const task = await this.tasksService.findOneByIdAndUserId(taskId, userId);

    return response.status(STATUS.OK).json(task);
  }

  public async completeTask(req: Request, res: Response) {
    const { session, params } = req;
    const { body } = req;

    if (!params?.taskId || !body?.day) {
      throw new BadRequestException('taskId not found');
    }

    const updated = await this.tasksService
    .completeTaskDay(session.id, params.taskId, body?.day);

    return res.status(STATUS.OK).json(updated);
  }

  public async updateCompletedArray(req: Request, res: Response) {
    const { params, body, session } = req;
    const { id: userId } = session;
    const { arrayToConclude } = body;
    const { taskId } = params;

    const updated = await this.tasksService.updateArrayCompleted({
      completedArray: arrayToConclude,
      taskId,
      userId,
    });

    return res.status(STATUS.OK).json(updated);
  }

  public async delete(req: Request, res: Response) {
    const { params } = req;
    const { session } = req;

    const [taskId, userId] = [params.taskId, session.id];

    await this.tasksService.deleteTask({ taskId, userId });

    return res.status(STATUS.OK).json({
      error: false,
    });
  }

  public async updateTask(req: Request, res: Response) {
    const { params, session } = req;

    const [taskId, userId] = [params.taskId, session.id];
    const updateTaskDto: UpdateTaskDto = req.body;
    updateTaskDto.id = taskId;

    const updatedTask = await this.tasksService.updateTask(updateTaskDto, userId);

    return res.status(STATUS.OK).json(updatedTask);
  }

  public async FindLates(req: Request, res: Response) {
    const { params } = req;
    const date: string | null = params.date;
    const userId = req.session.id;

    const tasks = await this.tasksService.findLates(userId, date);

    return res.status(STATUS.OK).json(tasks);
  }

  public async findByDate(req: Request, res: Response) {
    const { id } = req.session;
    const query: FindByDateDto = req.query as any;

    const tasks = await this.tasksService.findByDate(query, id);

    return res.status(STATUS.OK).json(tasks);
  }
}
