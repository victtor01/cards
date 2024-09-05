import { UpdateWorkspaceDto } from '@core/application/dtos/workspaces-dtos/update-workspace-dto';
import { Workspace, WorkspaceStatus } from '@core/domain/entities/workspace.entity';
import { IsNull, Repository, UpdateResult } from 'typeorm';
import { WorkspacesRepository } from '../workspaces.repository';

export class ImplementsWorkspacesRepository implements WorkspacesRepository {
  constructor(private readonly workspace: Repository<Workspace>) {}

  public async save({ id, name, userId, code, parentId }: Workspace): Promise<Workspace> {
    return await this.workspace.save({ id, name, userId, code, parentId });
  }

  public async findActivesByUserIdWithCards(userId: string): Promise<Workspace[]> {
    return await this.workspace.find({
      where: { status: WorkspaceStatus.ACTIVATED, userId },
      relations: {
        cards: true,
      },
    });
  }

  public async findDisabledByUser(userId: string): Promise<Workspace[]> {
    return await this.workspace.find({
      where: { status: WorkspaceStatus.DISABLED, userId },
    });
  }

  public async updateMany(ids: string[], data: UpdateWorkspaceDto): Promise<UpdateResult> {
    return await this.workspace.update(ids, data);
  }

  public async delete(id: string): Promise<any> {
    return await this.workspace.delete({ id });
  }

  public async update(id: string, data: UpdateWorkspaceDto): Promise<any> {
    return await this.workspace.update(id, data);
  }

  public async findOneByCodeWithWorkspacesAndCards(code: string): Promise<Workspace> {
    return await this.workspace.findOne({
      where: { code },
      relations: {
        workspaces: true,
        cards: true,
      },
    });
  }

  public async findOneById(workspaceId: string): Promise<Workspace> {
    return await this.workspace.findOneBy({
      id: workspaceId,
    });
  }

  public async findOneByIdWithRelations(workspaceId: string): Promise<Workspace> {
    return await this.workspace.findOne({
      where: { id: workspaceId },
      relations: {
        workspaces: true,
        cards: true,
      },
    });
  }

  public async findByRootsWithUser(userId: string): Promise<Workspace[]> {
    return await this.workspace.find({
      where: { userId, parentId: IsNull() },
    });
  }

  public async findByParentId(parentId: string): Promise<Workspace[]> {
    return await this.workspace.find({
      where: { parentId },
    });
  }
}
