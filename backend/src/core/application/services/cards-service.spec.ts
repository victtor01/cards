import { Card } from '@core/domain/entities/card.entity';
import { CardsRepository } from '@infra/repositories/cards.repository';
import { UnauthorizedException } from '@src/utils/errors';
import { beforeEach, describe, expect, it, Mock, vi } from 'vitest';
import { CreateCardDto } from '../dtos/create-card-dto';
import { WorkspacesServiceInterface } from '../interfaces/workspaces-service-interface';
import { CardsService } from './cards-service';

const cardsRepositoryMock = {
  save: vi.fn(),
  update: vi.fn(),
  findOneLatestUpdateByWorkspace: vi.fn(),
  findOneById: vi.fn(),
} satisfies CardsRepository;

describe('CardsService', () => {
  let cardsService: CardsService;
  let workspacesService: WorkspacesServiceInterface;

  beforeEach(() => {
    workspacesService = { findOneById: vi.fn() } as unknown as WorkspacesServiceInterface;
    cardsService = new CardsService(cardsRepositoryMock, workspacesService);
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

    (workspacesService.findOneById as Mock).mockResolvedValue(mockWorkspace);
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

    (workspacesService.findOneById as Mock).mockResolvedValue(mockWorkspace);

    await expect(cardsService.create(createCardDto, userId)).rejects.toThrow(UnauthorizedException);
  });
});
