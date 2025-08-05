import { Card } from '@core/domain/entities/card.entity';
import { CardsRepository } from '@infra/repositories/cards.repository';
import { BadRequestException, NotFoundException, UnauthorizedException } from '@src/utils/errors';
import logger from '@src/utils/logger';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { unlinkUploadFile } from '@src/utils/unlink';
import { nanoid } from 'nanoid';
import { UpdateCardDto } from '../dtos/cards-dtos/update-card-dto';
import { CreateCardDto } from '../dtos/create-card-dto';
import { CardsServiceInterface } from '../interfaces/cards-service-inteface';
import { FindWorkspacesServiceInterface } from '../interfaces/find-workspaces-interface';
import { CreateCardValidation } from '../validations/cards-schemas/create-card-schema';
import { updateCardValidation } from '../validations/cards-schemas/update-card-schema';

export class CardsService implements CardsServiceInterface {
  constructor(
    private readonly cardsRepo: CardsRepository,
    private readonly findWorkspacesServiceInterface: FindWorkspacesServiceInterface
  ) {}

  private readonly MAX_TOTAL_OF_CARDS: number = 200;

  public async findByPublicCode(code: string): Promise<Card> {
    const card: Card = await this.cardsRepo.findByCode(code).catch((err) => {
      logger.error('Houve um erro ao tentar pegar o card no [findByPublicCode]', err);
      return null;
    });

    return card;
  }

  public async publish(userId: string, cardId: string): Promise<void> {
    const card = await this.cardsRepo.findOneById(cardId).catch((err) => {
      logger.error('Houve um erro ao tentar buscar o card', err);
      return null;
    });

    if (!card?.id) {
      throw new NotFoundException('Card não encontrado!');
    }

    if (card?.userId !== userId) {
      throw new BadRequestException('Card não pertence ao usuário');
    }

    await this.cardsRepo.update(cardId, {
      publicId: nanoid(12),
    });
  }

  public async create(createCardDto: CreateCardDto, userId: string): Promise<Card> {
    const data = await CreateCardValidation.parseAsync(createCardDto).catch((err: any) =>
      ThrowErrorInValidationSchema(err)
    );

    const { title, content, workspaceId } = data;

    const workspace = await this.findWorkspacesServiceInterface.findOneById(workspaceId);

    if (workspace?.userId !== userId) {
      throw new UnauthorizedException('you don`t permission to create this card');
    }

    const quantityOfCards: Card[] = await this.cardsRepo.findAllByUser(userId);

    if (quantityOfCards?.length > this.MAX_TOTAL_OF_CARDS) {
      throw new BadRequestException('maximum number of cards exceeded');
    }

    const cardToCreate: Card = new Card({
      workspaceId,
      content,
      userId,
      title,
    });

    const card: Card = await this.cardsRepo.save(cardToCreate);

    return card;
  }

  public async findOneLatestUpdate(userId: string, workspaceId: string): Promise<Card> {
    if (!userId) throw new BadRequestException('params not found!');

    const card: Card = await this.cardsRepo.findOneLatestUpdateByWorkspace(userId, workspaceId);

    if (!card?.id) throw new NotFoundException('Card not found!');

    card.validateUser(userId);

    return card;
  }

  public async findOneByIdAndUser(cardId: string, userId: string): Promise<Card> {
    if (!cardId || !userId) throw new BadRequestException('params not found!');

    const card: Card = await this.cardsRepo.findOneById(cardId);
    card.validateUser(userId);

    return card;
  }

  public async update(cardId: string, userId: string, data: UpdateCardDto): Promise<any> {
    const card: Card | null = await this.findOneByIdAndUser(cardId, userId);

    if (!card) {
      throw new BadRequestException('card not found!');
    }

    const { title, content } = await updateCardValidation.parseAsync({
      title: data.title,
      content: data.content,
    });

    await this.cardsRepo.update(cardId, {
      title,
      content,
    });

    return true;
  }

  public async updateBackground(id: string, userId: string, background: string): Promise<boolean> {
    const card = await this.findOneByIdAndUser(id, userId);

    if (!card?.id) {
      throw new BadRequestException('file not found!');
    }

    if (card?.userId !== userId) {
      throw new UnauthorizedException('user does not have permission!');
    }

    if (card?.background) {
      unlinkUploadFile(card.background);
    }

    await this.cardsRepo.update(id, {
      background,
    });

    return true;
  }
}
