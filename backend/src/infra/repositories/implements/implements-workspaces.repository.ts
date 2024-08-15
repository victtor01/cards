import { Workspace } from '@core/domain/entities/workspace.entity';
import { IsNull, Repository } from 'typeorm';
import { WorkspacesRepository } from '../workspaces.repository';
import { UpdateWorkspaceDto } from '@core/application/dtos/workspaces-dtos/update-workspace-dto';

export class ImplementsWorkspacesRepository implements WorkspacesRepository {
  constructor(private readonly workspace: Repository<Workspace>) {}

  public async save({ name, userId, code, parentId }: Workspace): Promise<Workspace> {
    return await this.workspace.save({ name, userId, code, parentId });
  }

  public async findByUserIdWithCards(userId: string): Promise<Workspace[]> {
    return await this.workspace.find({
      where: { userId },
      relations: {
        cards: true,
      },
    });
  }

  public async update(id: string, data: UpdateWorkspaceDto): Promise<any> {
    return await this.workspace.update(id, data);
  }

  public async findOneByCodeWithWorkspaces(code: string): Promise<Workspace> {
    return await this.workspace.findOne({
      where: { code },
      relations: {
        workspaces: true,
      },
    });
  }

  public async findOneById(workspaceId: string): Promise<Workspace> {
    return await this.workspace.findOneBy({
      id: workspaceId,
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
