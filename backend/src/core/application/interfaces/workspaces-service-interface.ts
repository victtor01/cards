import { Workspace } from '@core/domain/entities/workspace.entity';
import { CreateWorkspaceDto } from '../dtos/create-workspace-dto';

export abstract class WorkspacesServiceInterface {
  abstract save(data: CreateWorkspaceDto): Promise<Workspace>;
  abstract findByUser(userId: string): Promise<Workspace[]>;
  abstract findByUserFormatTree(userId: string): Promise<Workspace[]>;
  abstract findOneByCodeAndUser(code: string, userId: string): Promise<Workspace>;
  abstract findOneWorkspaceWithTree(workspaceId: string, userId: string): Promise<Workspace>;
}
