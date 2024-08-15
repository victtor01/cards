import { Card } from '@core/domain/entities/card.entity';
import { CreateCardDto } from '../dtos/create-card-dto';

export abstract class CardsServiceInterface {
  abstract create(card: CreateCardDto, userId: string): Promise<Card>;
}
