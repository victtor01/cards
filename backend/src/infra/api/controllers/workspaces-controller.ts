import { WorkspacesServiceInterface } from '@core/application/interfaces/workspaces-interfaces/workspaces-service-interface';
import { BadRequestException } from '@src/utils/errors';
import { Request, Response } from 'express';

export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesServiceInterface) {}

  public async create(request: Request, response: Response) {
    const { id: userId } = request.session;
    const { body } = request;

    await this.workspacesService.save({ userId, ...body });

    response.status(200).json({
      error: false,
      message: 'workspace success created!',
    });
  }

  public async deleteBackground(request: Request, response: Response) {
    const { id: userId } = request.session;

    if (!request?.params?.code) throw new BadRequestException('params not found!');

    const { code } = request.params;

    await this.workspacesService.deleteBackgroundByCode(code, userId);

    response.status(200).json({
      error: false,
      message: 'updated success!',
    });
  }

  public async delete(request: Request, response: Response) {
    const { id: userId } = request.session;

    if (!request.params?.workspaceId) throw new BadRequestException('params not found!');

    const { workspaceId } = request.params;
    await this.workspacesService.delete(workspaceId, userId);

    response.status(200).json({ error: false });
  }

  public async findOneByIdWithTree(request: Request, response: Response) {
    const { id: userId } = request.session;
    const { workspaceId } = request.params;

    const workspace = await this.workspacesService.findOneWorkspaceWithTree(workspaceId, userId);

    response.status(200).json(workspace);
  }

  public async updateBackgroundByCode(request: Request, response: Response) {
    const { id: userId } = request.session;

    const {
      file: { filename: background },
    } = request;

    const { params } = request;

    if (!params?.code) {
      throw new BadRequestException('params not found!');
    }

    const { code } = params;

    const res = await this.workspacesService.updateBackgroundByCode({
      background,
      userId,
      code,
    });

    return response.status(200).json(res);
  }

  public async findWithTree(request: Request, response: Response) {
    const { id: userId } = request.session;

    const workspaces = await this.workspacesService.findByUserFormatTree(userId);

    response.status(200).json(workspaces);
  }

  public async findAll(request: Request, response: Response) {
    const { id: userId } = request.session;
    const workspaces = await this.workspacesService.findByUser(userId);

    response.status(200).json(workspaces);
  }

  public async findById(request: Request, response: Response) {
    const { id: userId } = request.session;
    const workspaceId = request.params.workspaceId || null;

    if (!workspaceId) throw new BadRequestException('not found workspace id');

    const workspace = await this.workspacesService.findOneByIdAndUser(workspaceId, userId);

    response.status(200).json(workspace);
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
