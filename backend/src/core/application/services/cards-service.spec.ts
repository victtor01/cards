import { Card } from '@core/domain/entities/card.entity';
import { CardsRepository } from '@infra/repositories/cards.repository';
import { NotFoundException, UnauthorizedException } from '@src/utils/errors';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { CreateCardDto } from '../dtos/create-card-dto';
import { FindWorkspacesServiceInterface } from '../interfaces/find-workspaces-interface';
import { CardsService } from './cards-service';

const cardsRepositoryMock = {
  save: vi.fn(),
  update: vi.fn(),
  findOneLatestUpdateByWorkspace: vi.fn(),
  findOneById: vi.fn(),
  findAllByUser: vi.fn(),
  findByCode: vi.fn(),
} satisfies CardsRepository;

describe('CardsService', () => {
  let cardsService: CardsService;
  let findWorksapcesService: FindWorkspacesServiceInterface;

  beforeEach(() => {
    findWorksapcesService = { findOneById: vi.fn() } as unknown as FindWorkspacesServiceInterface;

    cardsService = new CardsService(cardsRepositoryMock, findWorksapcesService);
  });

  it('should create a card', async () => {
    const createCardDto: CreateCardDto = {
      title: 'Test',
      content: 'Test content',
      workspaceId: 'workspace-id',
    };

    const mockCard = new Card({
      title: 'Test',
      content: 'Test content',
      workspaceId: 'workspace-id',
      userId: 'user-id',
    });

    const mockWorkspace = { userId: 'user-id' };
    const userId = 'user-id';

    (findWorksapcesService.findOneById as Mock).mockResolvedValue(mockWorkspace);
    cardsRepositoryMock.save.mockResolvedValue(mockCard);

    const result = await cardsService.create(createCardDto, userId);

    expect(result).toEqual(mockCard);
    expect(cardsRepositoryMock.save).toHaveBeenCalledWith(expect.any(Card));
  });

  it('should throw UnauthorizedException if user does not own workspace', async () => {
    const createCardDto: CreateCardDto = {
      title: 'Test',
      content: 'Test content',
      workspaceId: 'workspace-id',
    };

    const userId = 'user-id';
    const mockWorkspace = { userId: 'another-user-id' };

    (findWorksapcesService.findOneById as Mock).mockResolvedValue(mockWorkspace);

    await expect(cardsService.create(createCardDto, userId)).rejects.toThrow(UnauthorizedException);
  });

  describe('#supress', () => {
    it('should throw error when card not found', async () => {
      const userId = 'USERID';
      const cardId = 'NOT_FOUND';

      (cardsRepositoryMock.findOneById as Mock).mockResolvedValue(null);

      await expect(cardsService.supress(userId, cardId)).rejects.toThrow(NotFoundException);
    });

    it('should throw erro when card not belongs to user', async () => {
      const userId = 'USER_ID';
      const cardId = 'CARD_ID';

      const mockCard = new Card({
        title: 'Test',
        content: 'Test content',
        workspaceId: 'workspace-id',
        userId: 'user-id',
      });

      (cardsRepositoryMock.findOneById as Mock).mockResolvedValue(mockCard);

      await expect(cardsService.supress(userId, cardId)).rejects.toThrow(UnauthorizedException);
    });
  });
});
