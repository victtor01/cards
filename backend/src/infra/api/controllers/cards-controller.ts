import { CardsServiceInterface } from '@core/application/interfaces/cards-service-inteface';
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

  public async update(request: Request, response: Response) {
    const { body, session, params } = request;
    const { id: userId } = session;

    const cardId = params?.cardId || null;

    await this.cardsService.update(cardId, userId, body);

    response.status(200).json({
      error: false,
    });
  }

  public async findOneLatestUpdate(request: Request, response: Response) {
    const { session, params } = request;
    const { workspaceId } = params;
    const { id } = session;

    const workspace = await this.cardsService.findOneLatestUpdate(id, workspaceId);

    response.status(200).json(workspace);
  }

  public async updateBackground(request: Request, response: Response) {
    const { file, session, params } = request;
    const { id: userId } = session;
    const { filename } = file;

    const cardId = params?.cardId || null;

    await this.cardsService.updateBackground(cardId, userId, filename);

    response.status(200).json({
      error: false,
    });
  }

  public async findOneById(request: Request, response: Response) {
    const { session, params } = request;
    const { id: userId } = session;

    const card = await this.cardsService.findOneByIdAndUser(params.cardId, userId);

    response.status(200).json(card);
  }
}
