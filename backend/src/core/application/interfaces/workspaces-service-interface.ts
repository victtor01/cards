import { RenameWorkspaceDto } from '@core/application/dtos/workspaces-dtos/rename-workspace-dto';
import { UpdateBackgroundWorkspaceByIdDto } from '@core/application/dtos/workspaces-dtos/update-background-by-id';
import { UpdateBackgroundWorkspaceByCodeDto } from '@core/application/dtos/workspaces-dtos/update-background-dto';
import { Workspace } from '@core/domain/entities/workspace.entity';

export abstract class WorkspacesServiceInterface {
  abstract save(data: Workspace): Promise<Workspace>;
  abstract findByUserWithCards(userId: string): Promise<Workspace[]>;
  abstract findByUserFormatTree(userId: string): Promise<Workspace[]>;
  abstract enable(workspaceId: string, userId: string): Promise<boolean>;
  abstract findOneActiveByIdAndUser(id: string, userId: string): Promise<Workspace>;
  abstract findOneByCodeAndUser(code: string, userId: string): Promise<Workspace>;
  abstract findOneWorkspaceWithTree(workspaceId: string, userId: string): Promise<Workspace>;
  abstract updateBackgroundByCode(data: UpdateBackgroundWorkspaceByCodeDto): Promise<boolean>;
  abstract updateBackgroundById(data: UpdateBackgroundWorkspaceByIdDto): Promise<boolean>;
  abstract deleteBackgroundByCode(code: string, userId: string): Promise<boolean>;
  abstract deleteBackgroundById(id: string, userId: string): Promise<boolean>;
  abstract rename(data: RenameWorkspaceDto, userId: string): Promise<any>;
  abstract disableTree(id: string, userId: string): Promise<boolean>;
  abstract getDisabledByUser(userId: string): Promise<Workspace[]>;
  abstract delete(id: string, userId: string): Promise<boolean>;
  abstract findOneById(id: string): Promise<Workspace>;
}
