import { Workspace } from '@core/domain/entities/workspace.entity';
import { Repository } from 'typeorm';
import { WorkspacesRepository } from '../workspaces.repository';

export class ImplementsWorkspacesRepository implements WorkspacesRepository {
  constructor(private readonly workspace: Repository<Workspace>) {}

  public async save({ name, userId }: Workspace): Promise<Workspace> {
    return await this.workspace.save({ name, userId });
  }
}
