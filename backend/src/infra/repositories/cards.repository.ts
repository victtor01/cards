import { Card } from "@core/domain/entities/card.entity";

export abstract class CardsRepository {
  abstract save(card: Card): Promise<Card> 
}