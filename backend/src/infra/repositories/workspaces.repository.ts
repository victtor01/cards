import { CreateWorkspaceDto } from '@core/application/dtos/workspaces-dtos/create-workspace-dto';
import { Workspace } from '@core/domain/entities/workspace.entity';
import { UpdateWorkspaceDto } from '../../core/application/dtos/workspaces-dtos/update-workspace-dto';

export abstract class WorkspacesRepository {
  abstract save(workspace: Workspace): Promise<Workspace>;
  abstract findByUserIdWithCards(userId: string): Promise<Workspace[]>;
  abstract findOneByCodeWithWorkspacesAndCards(code: string): Promise<Workspace>;
  abstract findByParentId(parentId: string): Promise<Workspace[]>;
  abstract findOneById(workspaceId: string): Promise<Workspace>;
  abstract findOneByIdWithRelations(workspaceId: string): Promise<Workspace>;
  abstract findByRootsWithUser(userId: string): Promise<Workspace[]>;
  abstract update(id: string, data: UpdateWorkspaceDto): Promise<boolean>;
  abstract delete(id: string): Promise<boolean>
}
