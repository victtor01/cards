import { cardsRepositoryMock } from '@src/_tests_/cards-mocks';
import { workspaceServiceMock } from '@src/_tests_/workspaces-mocks';
import { beforeEach, describe, it } from 'vitest';
import { CardsServiceInterface } from '../interfaces/cards-interfaces/cards-service-inteface';
import { CardsService } from './cards-service';

describe('cards service', () => {
  let cardsService: CardsServiceInterface;

  beforeEach(() => {
    cardsService = new CardsService(cardsRepositoryMock, workspaceServiceMock);
  });

  it('should create a new card', async () => {
    
  });
});
