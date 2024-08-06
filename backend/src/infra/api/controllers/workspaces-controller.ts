import { WorkspacesServiceInterface } from '@core/application/interfaces/workspaces-service-interface';
import { Workspace } from '@core/domain/entities/workspace.entity';
import { Request, Response } from 'express';

export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesServiceInterface) {}

  public async create(request: Request, response: Response) {
    const { id: userId } = request.session;

    const {
      body: { name },
    } = request;

    await this.workspacesService.save({ name, userId });

    response.status(200).json({
      error: false,
      message: 'workspace success created!',
    });
  }

  public async findAll(request: Request, response: Response) {
    const { id: userId } = request.session;
    const workspaces = await this.workspacesService.findByUser(userId);

    response.status(200).json(workspaces);
  }

  public async findByCode(request: Request, response: Response) {
    const {
      session: { id: userId },
      params: { code },
    } = request;

    const workspace = await this.workspacesService.findOneByCodeAndUser(code, userId);

    response.status(200).json(workspace);
  }
}
