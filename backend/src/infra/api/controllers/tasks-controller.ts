import { TasksServiceInterface } from '@core/application/interfaces/tasks-interfaces/task-service-interface';
import { STATUS } from '@infra/config/constants/status';
import { Request, Response } from 'express';

export class TasksController {
  constructor(private readonly tasksService: TasksServiceInterface) {}

  public async create(req: Request, res: Response) {
    const { body } = req;
    const { id } = req.session;

    const created = await this.tasksService.create(body, id);

    res.status(STATUS.CREATED).json(created);
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

    res.json(STATUS.OK).json(updated);
  }

  public async findByDate(req: Request, res: Response) {
    const { id } = req.session;
    const { query } = req;

    const tasks = await this.tasksService.findByDate(query, id);

    res.status(STATUS.OK).json(tasks);
  }
}
