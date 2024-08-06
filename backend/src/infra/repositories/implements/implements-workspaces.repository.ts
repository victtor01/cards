import { Workspace } from '@core/domain/entities/workspace.entity';
import { Repository } from 'typeorm';
import { WorkspacesRepository } from '../workspaces.repository';

export class ImplementsWorkspacesRepository implements WorkspacesRepository {
  constructor(private readonly workspace: Repository<Workspace>) {}

  public async save({ name, userId, code }: Workspace): Promise<Workspace> {
    return await this.workspace.save({ name, userId, code });
  }

  public async findByUserId(userId: string): Promise<Workspace[]> {
    return await this.workspace.findBy({ userId });
  }

  public async findOneByCode(code: string): Promise<Workspace> {
    return await this.workspace.findOneBy({ code });
  }
}
