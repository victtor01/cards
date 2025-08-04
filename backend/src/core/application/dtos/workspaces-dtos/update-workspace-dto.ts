import { WorkspaceStatus } from '@core/domain/entities/workspace.entity';

export interface UpdateWorkspaceDto {
  status?: WorkspaceStatus;
  background?: string;
  name?: string;
  isPublic?: boolean;
}
