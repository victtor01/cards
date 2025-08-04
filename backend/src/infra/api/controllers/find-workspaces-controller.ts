import { FindWorkspacesServiceInterface } from '@core/application/interfaces/find-workspaces-interface';
import { BadRequestException } from '@src/utils/errors';
import { Request, Response } from 'express';

export class FindWorkspacesController {
  constructor(private readonly findWorkspaces: FindWorkspacesServiceInterface) {}

  public async findById(request: Request, response: Response) {
    const { id: userId } = request.session;
    const workspaceId = request.params.workspaceId || null;
    if (!workspaceId) throw new BadRequestException('not found workspace id');

    const workspace = await this.findWorkspaces.findOneActiveByIdAndUser(workspaceId, userId);

    response.status(200).json(workspace);
  }

  public async getDisabled(request: Request, response: Response) {
    const { id: userId } = request.session;
    const workspaces = await this.findWorkspaces.getDisabledByUser(userId);

    response.status(200).json(workspaces);
  }

  public async findWithTree(request: Request, response: Response) {
    const { id: userId } = request.session;

    const workspaces = await this.findWorkspaces.findByUserFormatTree(userId);

    response.status(200).json(workspaces);
  }

  public async findAll(request: Request, response: Response) {
    const { id: userId } = request.session;
    const workspaces = await this.findWorkspaces.findByUserWithCards(userId);

    response.status(200).json(workspaces);
  }

  public async findByCode(request: Request, response: Response) {
    const {
      session: { id: userId },
      params: { code },
    } = request;

    const workspace = await this.findWorkspaces.findOneByCodeAndUser(code, userId);

    response.status(200).json(workspace);
  }

  public async findOneByIdWithTree(request: Request, response: Response) {
    const { id: userId } = request.session;
    const { workspaceId } = request.params;

    const workspace = await this.findWorkspaces.findOneWorkspaceWithTree(workspaceId, userId);

    response.status(200).json(workspace);
  }
}
