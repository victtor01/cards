import { RenameWorkspaceDto } from '@core/application/dtos/workspaces-dtos/rename-workspace-dto';
import { UpdateBackgroundWorkspaceByIdDto } from '@core/application/dtos/workspaces-dtos/update-background-by-id';
import { UpdateBackgroundWorkspaceByCodeDto } from '@core/application/dtos/workspaces-dtos/update-background-dto';
import { Workspace } from '@core/domain/entities/workspace.entity';
import { CreateWorkspaceDto } from '../dtos/workspaces-dtos/create-workspace-dto';

export abstract class WorkspacesServiceInterface {
  abstract save(data: CreateWorkspaceDto): Promise<Workspace>;
  abstract enable(workspaceId: string, userId: string): Promise<boolean>;
  abstract updateBackgroundByCode(data: UpdateBackgroundWorkspaceByCodeDto): Promise<boolean>;
  abstract updateBackgroundById(data: UpdateBackgroundWorkspaceByIdDto): Promise<boolean>;
  abstract deleteBackgroundByCode(code: string, userId: string): Promise<boolean>;
  abstract deleteBackgroundById(id: string, userId: string): Promise<boolean>;
  abstract rename(data: RenameWorkspaceDto, userId: string): Promise<any>;
  abstract disableTree(id: string, userId: string): Promise<boolean>;
  abstract delete(id: string, userId: string): Promise<boolean>;
}