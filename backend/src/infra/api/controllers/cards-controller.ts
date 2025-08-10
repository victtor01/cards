import { CardsServiceInterface } from '@core/application/interfaces/cards-service-inteface';
import { NotFoundException } from '@src/utils/errors';
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

  public async findByPublicCode(request: Request, response: Response) {
    const { params } = request;

    const code = params?.code;

    if (!code) {
      throw new NotFoundException('Código faltando na requisição');
    }

    const card = await this.cardsService.findByPublicCode(code);

    response.status(200).json(card);
  }

  public async supress(request: Request, response: Response) {
    const { params, session } = request;
    const { id: userId } = session;
    const cardId = params?.cardId;

    if (!cardId) {
      throw new NotFoundException('Código faltando na requisição');
    }

    await this.cardsService.supress(userId, cardId);

    response.status(200).json({ publicId: null });
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

  public async publish(request: Request, response: Response) {
    const { session, body } = request;

    const { id: userId } = session;
    const { cardId } = body;

    await this.cardsService.publish(userId, cardId);

    response.status(200).json({ publish: true });
  }
}
