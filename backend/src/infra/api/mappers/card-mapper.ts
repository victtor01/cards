import { Card } from '@core/domain/entities/card.entity';
import { CardResponse } from '../dtos/card-response';
import { WorkspaceMapper } from './workspace-mapper';

export class CardMapper {
  public static toResponse(card: Card): CardResponse {
    if (!card) return null;

    return {
      id: card?.id,
      title: card?.title,
      content: card?.content,
      background: card?.background,
      publicId: card?.publicId,
      userId: card?.userId,
      workspaceId: card?.workspaceId,
      workspace: WorkspaceMapper.toResponse(card.workspace),
      createdAt: card?.createdAt?.toISOString(),
      updatedAt: card?.updatedAt?.toISOString(),
    };
  }

  public static toSimpleResponse(card: Card): CardResponse {
    if (!card) return null;

    return {
      id: card?.id,
      title: card?.title,
      publicId: card?.publicId,
    };
  }
}
