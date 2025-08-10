import { UpdateCardDto } from '@core/application/dtos/cards-dtos/update-card-dto';
import { CreateCardDto } from '@core/application/dtos/create-card-dto';
import { Card } from '@core/domain/entities/card.entity';

export abstract class CardsServiceInterface {
  abstract create(card: CreateCardDto, userId: string): Promise<Card>;
  abstract update(cardId: string, userId: string, data: UpdateCardDto): Promise<any>;
  abstract updateBackground(id: string, userId: string, background: string): Promise<boolean>;
  abstract findOneByIdAndUser(id: string, userId: string): Promise<Card>;
  abstract findOneLatestUpdate(userId: string, workspaceId: string): Promise<Card>;
  abstract publish(userId: string, cardId: string): Promise<void>;
  abstract findByPublicCode(code: string): Promise<Card>;
  abstract supress(userId: string, cardId: string): Promise<void>;
}
