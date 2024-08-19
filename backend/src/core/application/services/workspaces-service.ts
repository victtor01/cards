import { Workspace } from '@core/domain/entities/workspace.entity';
import { WorkspacesRepository } from '@infra/repositories/workspaces.repository';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { CreateWorkspaceDto } from '../dtos/workspaces-dtos/create-workspace-dto';
import { WorkspacesServiceInterface } from '../interfaces/workspaces-interfaces/workspaces-service-interface';
import { createWorkspaceSchema } from '../validations/workspaces-schemas/create-workspace-schema';
import { BadRequestException, UnauthorizedException } from '@src/utils/errors';
import { UpdateBackgroundWorkspaceByCodeDto } from '../dtos/workspaces-dtos/update-background-dto';
import { unlinkUploadFile } from '@src/utils/unlink';

export class WorkspacesService implements WorkspacesServiceInterface {
  constructor(private readonly workspaceRepository: WorkspacesRepository) {}

  public async save(data: CreateWorkspaceDto): Promise<Workspace> {
    const { name, userId } = await createWorkspaceSchema
      .parseAsync(data)
      .catch((err) => ThrowErrorInValidationSchema(err));

    const parentId = data?.parentId || null;

    const workspaceToCreate = new Workspace({ name, userId });

    const workspaceParent = !!data?.parentId ? await this.findOneById(parentId) : null;

    if (workspaceParent?.id && workspaceParent?.userId === userId) {
      workspaceToCreate.parentId = parentId;
    }

    const workspace = await this.workspaceRepository.save(workspaceToCreate);

    return workspace;
  }

  public async updateBackgroundByCode(data: UpdateBackgroundWorkspaceByCodeDto): Promise<boolean> {
    if (!data?.code) throw new BadRequestException('Params not found to udpate background!');

    const { code, background, userId } = data;
    const workspace = await this.findOneByCodeAndUser(code, userId);

    if (!workspace?.id) throw new BadRequestException('workspace not found!');

    await this.workspaceRepository.update(workspace.id, {
      background,
    });

    if (workspace.background) unlinkUploadFile(workspace.background);

    return true;
  }

  public async findOneWorkspaceWithTree(workspaceId: string, userId: string): Promise<Workspace> {
    const workspaces = await this.workspaceRepository.findByUserIdWithCards(userId);

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

  public async delete(id: string, userId: string): Promise<boolean> {
    const workspace = await this.workspaceRepository.findOneById(id);
    if (workspace?.userId !== userId) throw new UnauthorizedException('user don`t permission!');
    await this.workspaceRepository.delete(id);

    return true;
  }

  private buildTree(workspaces: Workspace[]): Workspace[] {
    const tree: Workspace[] = [];
    const map: { [key: number]: Workspace } = {};

    workspaces.forEach((node) => {
      map[node.id] = node;
      node.workspaces = [];
    });

    workspaces.forEach((node) => {
      if (node.parentId) {
        map[node.parentId].workspaces.push(node);
      } else {
        tree.push(node);
      }
    });

    return tree;
  }

  public async findByUserFormatTree(userId: string): Promise<any> {
    const workspaces = await this.workspaceRepository.findByUserIdWithCards(userId);
    const build = this.buildTree(workspaces);

    return build;
  }

  public async findByUser(userId: string): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.findByUserIdWithCards(userId);

    return workspaces;
  }

  public async findOneById(workspaceId: string) {
    return await this.workspaceRepository.findOneById(workspaceId);
  }

  public async findOneByCodeAndUser(code: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOneByCodeWithWorkspacesAndCards(code);

    if (workspace?.userId !== userId) {
      throw new UnauthorizedException('workspace not exists!');
    }

    return workspace;
  }
}
