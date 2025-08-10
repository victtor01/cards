import { WorkspaceResponse } from './workspace-response';

export interface CardResponse {
  id?: string;
  title?: string;
  content?: string;
  background?: string;
  publicId?: string;
  userId?: string;
  user?: string;
  workspaceId?: string;
  workspace?: WorkspaceResponse;
  createdAt?: string;
  updatedAt?: string;
}
