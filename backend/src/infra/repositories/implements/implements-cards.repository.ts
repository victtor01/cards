import { UpdateCardDto } from '@core/application/dtos/cards-dtos/update-card-dto';
import { Card } from '@core/domain/entities/card.entity';
import { ILike, IsNull, Like, Not, Repository } from 'typeorm';
import { CardsRepository } from '../cards.repository';

export class ImplementsCardsRepository implements CardsRepository {
  constructor(private readonly cardsRepo: Repository<Card>) {}
  
  public async findPublicsByName(name: string): Promise<Card[]> {
    return await this.cardsRepo.find({
      where: { title: Like(`%${name}%`), publicId: Not(IsNull()) }
    });
  }
  
  public async findAllByName(name: string, userId: string): Promise<Card[]> {
    return await this.cardsRepo.find({
      where: { userId, title: ILike(`%${name}%`) }
    });
  }

  public async findByCode(code: string): Promise<Card> {
    return await this.cardsRepo.findOne({
      where: { publicId: code },
    });
  }

  public async findAllByUser(userId: string): Promise<Card[]> {
    return await this.cardsRepo.find({
      where: {
        userId,
      },
    });
  }

  public async save(card: Card): Promise<Card> {
    return await this.cardsRepo.save(card);
  }

  public async findOneLatestUpdateByWorkspace(userId: string, workspaceId: string): Promise<Card> {
    return await this.cardsRepo.findOne({
      order: { updatedAt: 'DESC' },
      where: { userId, workspaceId },
    });
  }

  public async update(
    id: string,
    { title, content, background, publicId }: UpdateCardDto
  ): Promise<any> {
    return await this.cardsRepo.update(id, { title, content, background, publicId });
  }

  public async findOneById(id: string): Promise<Card> {
    return await this.cardsRepo.findOneBy({ id });
  }
}
