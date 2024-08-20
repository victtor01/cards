import { Repository } from 'typeorm';
import { CardsRepository } from '../cards.repository';
import { Card } from '@core/domain/entities/card.entity';
import { UpdateCardDto } from '@core/application/dtos/cards-dtos/update-card-dto';

export class ImplementsCardsRepository implements CardsRepository {
  constructor(private readonly cardsRepo: Repository<Card>) {}

  public async save(card: Card): Promise<Card> {
    return await this.cardsRepo.save(card);
  }

  public async update(id: string, { title, content }: UpdateCardDto): Promise<any> {
    return await this.cardsRepo.update(id, { title, content });
  }

  public async findOneById(id: string): Promise<Card> {
    return await this.cardsRepo.findOneBy({ id });
  }
}
