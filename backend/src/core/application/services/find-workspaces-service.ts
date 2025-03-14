import { Workspace } from '@core/domain/entities/workspace.entity';
import { WorkspacesRepository } from '@infra/repositories/workspaces.repository';
import { BadRequestException, UnauthorizedException } from '@src/utils/errors';
import { IFindWorkspacesService } from '../interfaces/find-workspaces-interface';
import { WorkspaceTree } from '../utils/workspace-tree';

export class FindWorkspacesService implements IFindWorkspacesService {
  constructor(private readonly workspaceRepository: WorkspacesRepository) {}

  public async findByUserWithCards(userId: string): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.findActivesByUserIdWithCards(userId);

    return workspaces;
  }

  public async findByUserFormatTree(userId: string): Promise<any> {
    const workspaces = await this.workspaceRepository.findActivesByUserIdWithCards(userId);
    if (!workspaces?.length) return [];

    return WorkspaceTree.build(workspaces);
  }

  public async findOneActiveByIdAndUser(id: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOneActiveByIdWithRelations(id);

    if (workspace?.userId !== userId) {
      throw new UnauthorizedException('workspace not exists!');
    }

    return workspace;
  }

  public async findOneByCodeAndUser(code: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOneByCodeWithWorkspacesAndCards(code);

    if (workspace?.userId !== userId) {
      throw new UnauthorizedException('workspace not exists!');
    }

    return workspace;
  }

  public async findOneWorkspaceWithTree(workspaceId: string, userId: string): Promise<Workspace> {
    const workspaces = await this.workspaceRepository.findActivesByUserIdWithCards(userId);

    const rootWorkspace = workspaces.find((ws) => ws.id === workspaceId);
    if (!rootWorkspace) throw new BadRequestException('Workspace not found');

    const workspaceMap = new Map<string, Workspace>();
    workspaces.forEach((workspace) => {
      workspaceMap.set(workspace.id, { ...workspace, workspaces: [] });
    });

    workspaces.forEach((workspace) => {
      if (workspace.parentId) {
        const parentWorkspace = workspaceMap.get(workspace.parentId);
        if (parentWorkspace) {
          parentWorkspace.workspaces.push(workspaceMap.get(workspace.id));
        }
      }
    });

    return workspaceMap.get(rootWorkspace.id);
  }

  public async getDisabledByUser(userId: string): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.findDisabledByUser(userId);

    return workspaces;
  }

  public async findOneById(workspaceId: string) {
    return await this.workspaceRepository.findOneById(workspaceId);
  }
}