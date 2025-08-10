import { Workspace } from '@core/domain/entities/workspace.entity';
import { WorkspaceResponse } from '../dtos/workspace-response';
import { CardMapper } from './card-mapper';

export class WorkspaceMapper {
  public static toResponse(workspace: Workspace): WorkspaceResponse {
    return {
      id: workspace.id,
      name: workspace.name,
      status: workspace.status,
      userId: workspace.userId,
      code: workspace.code,
      parentId: workspace.parentId,
      background: workspace.background,
      isPublic: workspace.isPublic,
      workspaces: workspace.workspaces?.map((ws) => WorkspaceMapper.toSimpleResponse(ws)),
      cards: workspace.cards?.map((card) => CardMapper.toSimpleResponse(card)),
      parent: undefined,
    };
  }

  public static toSimpleResponse(workspace: Workspace): WorkspaceResponse {
    return {
      id: workspace.id,
      name: workspace.name,
      status: workspace.status,
      code: workspace.code,
      parentId: workspace.parentId,
      background: workspace.background,
      isPublic: workspace.isPublic,
    };
  }
}
