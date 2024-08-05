import { Workspace } from '@core/domain/entities/workspace.entity';

export abstract class WorkspacesRepository {
  abstract save(workspace: Workspace): Promise<Workspace>;
}
