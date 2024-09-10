import { Card } from '@core/domain/entities/card.entity';
import { CardsRepository } from '@infra/repositories/cards.repository';
import { BadRequestException, UnauthorizedException } from '@src/utils/errors';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { unlinkUploadFile } from '@src/utils/unlink';
import { UpdateCardDto } from '../dtos/cards-dtos/update-card-dto';
import { CreateCardDto } from '../dtos/create-card-dto';
import { CardsServiceInterface } from '../interfaces/cards-interfaces/cards-service-inteface';
import { WorkspacesServiceInterface } from '../interfaces/workspaces-interfaces/workspaces-service-interface';
import { CreateCardValidation } from '../validations/cards-schemas/create-card-schema';
import { updateCardValidation } from '../validations/cards-schemas/update-card-schema';

export class CardsService implements CardsServiceInterface {
  constructor(
    private readonly cardsRepo: CardsRepository,
    private readonly workspacesService: WorkspacesServiceInterface
  ) {}

  public async create(createCardDto: CreateCardDto, userId: string): Promise<Card> {
    const { title, content, workspaceId } = await CreateCardValidation.parseAsync(
      createCardDto
    ).catch((err: any) => ThrowErrorInValidationSchema(err));

    const workspace = await this.workspacesService.findOneById(workspaceId);

    if (workspace?.userId !== userId) {
      throw new UnauthorizedException('you don`t permission to create this card');
    }

    const cardToCreate = new Card({
      workspaceId,
      content,
      userId,
      title,
    });

    const card = await this.cardsRepo.save(cardToCreate);

    return card;
  }

  public async findOneLatestUpdate(userId: string, workspaceId: string): Promise<Card> {
    if (!userId) throw new BadRequestException('params not found!');

    const card = await this.cardsRepo.findOneLatestUpdateByWorkspace(userId, workspaceId);

    if (card?.userId !== userId) {
      throw new UnauthorizedException('card not found!');
    }

    return card;
  }

  public async findOneByIdAndUser(cardId: string, userId: string): Promise<Card> {
    if (!cardId || !userId) throw new BadRequestException('params not found!');

    const card = await this.cardsRepo.findOneById(cardId);

    if (card?.userId !== userId) {
      throw new UnauthorizedException('card not found!');
    }

    return card;
  }

  public async update(cardId: string, userId: string, data: UpdateCardDto): Promise<any> {
    const card = await this.findOneByIdAndUser(cardId, userId);

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

    if (!!card?.background) {
      unlinkUploadFile(card.background);
    }

    await this.cardsRepo.update(id, {
      background,
    });

    return true;
  }
}
