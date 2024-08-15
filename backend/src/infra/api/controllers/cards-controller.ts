import { CardsServiceInterface } from '@core/application/interfaces/cards-interfaces/cards-service-inteface';
import { Request, Response } from 'express';

export class CardsController {
  constructor(private readonly cardsService: CardsServiceInterface) {}

  public async create(request: Request, response: Response) {
    const { body, session } = request;
    const { id: userId } = session;

    const created = await this.cardsService.create(body, userId);

    return response.status(201).json({
      title: created.title,
    });
  }
}
