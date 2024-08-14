import { Workspace } from '@core/domain/entities/workspace.entity';

export abstract class WorkspacesRepository {
  abstract save(workspace: Workspace): Promise<Workspace>;
  abstract findByUserIdWithCards(userId: string): Promise<Workspace[]>;
  abstract findOneByCodeWithWorkspaces(code: string): Promise<Workspace>;
  abstract findByParentId(parentId: string): Promise<Workspace[]>;
  abstract findOneById(workspaceId: string): Promise<Workspace>;
  abstract findByRootsWithUser(userId: string): Promise<Workspace[]>;
}
