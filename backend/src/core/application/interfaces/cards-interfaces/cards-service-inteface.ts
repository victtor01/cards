import { Card } from '@core/domain/entities/card.entity';
import { UpdateCardDto } from '@core/application/dtos/cards-dtos/update-card-dto';
import { CreateCardDto } from '@core/application/dtos/create-card-dto';

export abstract class CardsServiceInterface {
  abstract create(card: CreateCardDto, userId: string): Promise<Card>;
  abstract update(cardId: string, userId: string, data: UpdateCardDto): Promise<any>;
  abstract findOneByIdAndUser(id: string, userId: string): Promise<Card>;
  abstract updateBackground(id: string, userId: string, background: string): Promise<boolean>;
}
