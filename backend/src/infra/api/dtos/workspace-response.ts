import { WorkspaceStatus } from '@core/domain/entities/workspace.entity';
import { CardResponse } from './card-response';

export class WorkspaceResponse {
  id?: string;
  name?: string;
  status?: WorkspaceStatus;
  userId?: string;
  code?: string;
  parentId?: string = null;
  background?: string;
  parent?: WorkspaceResponse;
  isPublic?: boolean = false;
  workspaces?: WorkspaceResponse[];
  cards?: CardResponse[];
}
