import { Workspace } from '@core/domain/entities/workspace.entity';

export abstract class WorkspacesRepository {
  abstract save(workspace: Workspace): Promise<Workspace>;
  abstract findByUserId(userId: string): Promise<Workspace[]>;
  abstract findOneByCode(code: string): Promise<Workspace>;
}
