import { Card } from '@core/domain/entities/card.entity';
import { CardsRepository } from '@infra/repositories/cards.repository';
import { CreateCardDto } from '../dtos/create-card-dto';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { CreateCardSchema } from '../validations/cards-schemas/create-card-schema';
import { WorkspacesServiceInterface } from '../interfaces/workspaces-interfaces/workspaces-service-interface';
import { UnauthorizedException } from '@src/utils/errors';
import { CardsServiceInterface } from '../interfaces/cards-interfaces/cards-service-inteface';

export class CardsService implements CardsServiceInterface {
  constructor(
    private readonly cardsRepo: CardsRepository,
    private readonly workspacesService: WorkspacesServiceInterface
  ) {}

  public async create(createCardDto: CreateCardDto, userId: string): Promise<Card> {
    const { title, content, workspaceId } = await CreateCardSchema.parseAsync(
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

    console.log(cardToCreate);

    const card = await this.cardsRepo.save(cardToCreate);

    return card;
  }
}
