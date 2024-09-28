import { Workspace, WorkspaceStatus } from '@core/domain/entities/workspace.entity';
import { WorkspacesRepository } from '@infra/repositories/workspaces.repository';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@src/utils/errors';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { unlinkUploadFile } from '@src/utils/unlink';
import { CreateWorkspaceDto } from '../dtos/workspaces-dtos/create-workspace-dto';
import { RenameWorkspaceDto } from '../dtos/workspaces-dtos/rename-workspace-dto';
import { UpdateBackgroundWorkspaceByIdDto } from '../dtos/workspaces-dtos/update-background-by-id';
import { UpdateBackgroundWorkspaceByCodeDto } from '../dtos/workspaces-dtos/update-background-dto';
import { WorkspacesServiceInterface } from '../interfaces/workspaces-interfaces/workspaces-service-interface';
import { createWorkspaceSchema } from '../validations/workspaces-schemas/create-workspace-schema';

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

  public async findOneActiveByIdAndUser(id: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOneActiveByIdWithRelations(id);

    if (workspace?.userId !== userId) {
      throw new UnauthorizedException('workspace not exists!');
    }

    return workspace;
  }

  public async rename({ id, name }: RenameWorkspaceDto, userId: string): Promise<boolean> {
    const workspace = await this.findOneActiveByIdAndUser(id, userId);

    if (!workspace?.id) {
      throw new NotFoundException('workspace not found!');
    }

    if (workspace?.userId !== userId) {
      throw new UnauthorizedException('user not does permission!');
    }

    await this.workspaceRepository.update(id, { name });

    return true;
  }

  public async findOneByCodeAndUser(code: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOneByCodeWithWorkspacesAndCards(code);

    if (workspace?.userId !== userId) {
      throw new UnauthorizedException('workspace not exists!');
    }

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

    const workspaceWithTree = workspaceMap.get(rootWorkspace.id);

    return workspaceWithTree;
  }

  public async findOneById(workspaceId: string) {
    return await this.workspaceRepository.findOneById(workspaceId);
  }
  
  public async disableTree(workspaceId: string, userId: string): Promise<boolean> {
    const parent = await this.findOneById(workspaceId);

    if (!parent?.id) {
      throw new BadRequestException('Workspace not found!');
    }

    const allWorkspaces = await this.findByUserWithCards(userId);
    const workspacesToDisable = new Set<Workspace>([parent]);

    const collectChildren = (parentId: string) => {
      allWorkspaces
        .filter((workspace) => workspace.parentId === parentId)
        .forEach((child) => {
          workspacesToDisable.add(child);

          if (child?.id) collectChildren(child.id);
        });
    };

    collectChildren(parent.id);

    const idsToDisable = Array.from(workspacesToDisable, (workspace) => workspace.id);
    await this.workspaceRepository.updateMany(idsToDisable, {
      status: WorkspaceStatus.DISABLED,
    });

    return true;
  }

  public async enable(workspaceId: string, userId: string): Promise<boolean> {
    const workspace = await this.workspaceRepository.findOneById(workspaceId);

    if (workspace?.userId !== userId || !workspace?.id) {
      throw new UnauthorizedException('not found workspace!');
    }

    await this.workspaceRepository.update(workspaceId, {
      status: WorkspaceStatus.ACTIVATED,
    });

    return true;
  }

  public async getDisabledByUser(userId: string): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.findDisabledByUser(userId);

    return workspaces;
  }

  public async updateBackgroundById(data: UpdateBackgroundWorkspaceByIdDto): Promise<boolean> {
    if (!data?.id) throw new BadRequestException('Params not found to udpate background!');

    const { id, background, userId } = data;
    const workspace = await this.findOneById(id);

    if (!workspace?.id) throw new BadRequestException('workspace not found!');

    if (workspace?.userId !== userId) throw new UnauthorizedException('workspace not found!');

    await this.workspaceRepository.update(workspace.id, {
      background,
    });

    if (workspace.background) unlinkUploadFile(workspace.background);

    return true;
  }

  public async deleteBackgroundByCode(code: string, userId: string): Promise<boolean> {
    const workspace = await this.findOneByCodeAndUser(code, userId);

    unlinkUploadFile(workspace.background);

    await this.workspaceRepository.update(workspace.id, {
      background: null,
    });

    return true;
  }

  public async deleteBackgroundById(id: string, userId: string): Promise<boolean> {
    const workspace = await this.findOneById(id);

    if (workspace?.userId !== userId) throw new UnauthorizedException('workspace not found!');

    unlinkUploadFile(workspace.background);

    await this.workspaceRepository.update(workspace.id, {
      background: null,
    });

    return true;
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    const workspace = await this.workspaceRepository.findOneById(id);

    if (workspace?.userId !== userId) throw new UnauthorizedException('user don`t permission!');

    if (workspace?.background) unlinkUploadFile(workspace.background);

    await this.workspaceRepository.delete(id);

    return true;
  }

  public async deleteWithTree(id: string, userId: string): Promise<boolean> {
    const workspace = await this.workspaceRepository.findOneById(id);

    if (workspace?.userId !== userId) throw new UnauthorizedException('user don`t permission!');

    if (workspace?.cards) {
      const { cards } = workspace;

      cards.forEach((element) => {
        unlinkUploadFile(element.background);
      });
    }

    if (workspace?.background) {
      unlinkUploadFile(workspace.background);
    }

    await this.workspaceRepository.delete(id);

    return true;
  }

  public async findByUserFormatTree(userId: string): Promise<any> {
    const workspaces = await this.workspaceRepository.findActivesByUserIdWithCards(userId);

    if (!workspaces?.length) return [];

    const build = this.buildTree(workspaces);

    return build;
  }

  public async findByUserWithCards(userId: string): Promise<Workspace[]> {
    const workspaces = await this.workspaceRepository.findActivesByUserIdWithCards(userId);

    return workspaces;
  }

  private buildTree(workspaces: Workspace[]): Workspace[] {
    const tree: Workspace[] = [];
    const map: { [key: number]: Workspace } = {};

    workspaces?.forEach((node) => {
      map[node.id] = node;
      node.workspaces = [];
    });

    workspaces?.forEach((node) => {
      if (node?.parentId && map[node.parentId]) {
        map[node.parentId].workspaces.push(node);
      } else {
        tree.push(node);
      }
    });

    return tree;
  }
}
