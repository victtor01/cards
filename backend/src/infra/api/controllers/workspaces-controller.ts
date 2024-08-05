import { WorkspacesServiceInterface } from '@core/application/interfaces/workspaces-service-interface';
import { Request, Response } from 'express';

export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesServiceInterface) {}

  public async index(req: Request, res: Response) {
    const { body } = req;
    const { name } = body;

    const { id: userId } = req.session;

    console.log(req.session)

    await this.workspacesService.save({ name, userId });

    res.status(200).json({
      error: false,
      message: 'workspace success created!',
    });
  }
}
