import { UpdateBackgroundWorkspaceByCodeDto } from '@core/application/dtos/workspaces-dtos/update-background-dto';
import { Workspace } from '@core/domain/entities/workspace.entity';

export abstract class WorkspacesServiceInterface {
  abstract save(data: Workspace): Promise<Workspace>;
  abstract findByUser(userId: string): Promise<Workspace[]>;
  abstract findByUserFormatTree(userId: string): Promise<Workspace[]>;
  abstract findOneByCodeAndUser(code: string, userId: string): Promise<Workspace>;
  abstract findOneWorkspaceWithTree(workspaceId: string, userId: string): Promise<Workspace>;
  abstract findOneById(id: string): Promise<Workspace>;
  abstract updateBackgroundByCode(data: UpdateBackgroundWorkspaceByCodeDto): Promise<boolean>
  abstract delete(id: string, userId: string): Promise<boolean>
}
