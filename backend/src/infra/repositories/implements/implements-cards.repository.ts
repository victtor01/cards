import { Repository } from "typeorm";
import { CardsRepository } from "../cards.repository";
import { Card } from "@core/domain/entities/card.entity";

export class ImplementsCardsRepository implements CardsRepository {
  constructor(private readonly cardsRepo: Repository<Card>) {}

  public async save(card: Card): Promise<Card> {
    return await this.cardsRepo.save(card);
  }

}