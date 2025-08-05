import { UpdateCardDto } from '@core/application/dtos/cards-dtos/update-card-dto';
import { Card } from '@core/domain/entities/card.entity';

export abstract class CardsRepository {
  abstract save(card: Card): Promise<Card>;
  abstract update(id: string, data: UpdateCardDto): Promise<any>;
  abstract findOneLatestUpdateByWorkspace(userId: string, workspaceId: string): Promise<Card>;
  abstract findOneById(id: string): Promise<Card>;
  abstract findAllByUser(userId: string): Promise<Card[]>;
  abstract findByCode(code: string): Promise<Card>;
}
