import { CardsService } from '@core/application/services/cards-service';
import { Card } from '@core/domain/entities/card.entity';
import { CardsController } from '@infra/api/controllers/cards-controller';
import { sessionMiddleware } from '@infra/api/middlewares/session.middleware';
import { AppDataSource } from '@infra/database';
import { Router } from 'express';
import { workspacesService } from './workspaces-routes';
import { ImplementsCardsRepository } from '@infra/repositories/implements/implements-cards.repository';

const cardsRoutes = Router();

cardsRoutes.use(sessionMiddleware);

const cardsRepository = new ImplementsCardsRepository(AppDataSource.getRepository(Card));
const cardsService = new CardsService(cardsRepository, workspacesService);
const cardsController = new CardsController(cardsService);

cardsRoutes.post('/', (req, res) => cardsController.create(req, res));
cardsRoutes.get('/:cardId', (req, res) => cardsController.findOneById(req, res))
cardsRoutes.put('/:cardId', (req, res) => cardsController.update(req, res));


export { cardsRoutes };
