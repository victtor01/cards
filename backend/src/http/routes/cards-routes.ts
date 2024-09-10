import { CardsService } from '@core/application/services/cards-service';
import { Card } from '@core/domain/entities/card.entity';
import { CardsController } from '@infra/api/controllers/cards-controller';
import { sessionMiddleware } from '@infra/api/middlewares/session.middleware';
import config from '@infra/config/constants/multer';
import { AppDataSource } from '@infra/database';
import { ImplementsCardsRepository } from '@infra/repositories/implements/implements-cards.repository';
import { Router } from 'express';
import multer from 'multer';
import { workspacesService } from './workspaces-routes';

const cardsRoutes = Router();
const upload = multer(config);

cardsRoutes.use(sessionMiddleware);

const cardsRepository = new ImplementsCardsRepository(AppDataSource.getRepository(Card));
const cardsService = new CardsService(cardsRepository, workspacesService);
const cardsController = new CardsController(cardsService);

cardsRoutes.post('/', (req, res) => cardsController.create(req, res));
cardsRoutes.get('/:cardId', (req, res) => cardsController.findOneById(req, res));
cardsRoutes.put('/:cardId', (req, res) => cardsController.update(req, res));
cardsRoutes.get('/latest/:workspaceId', (req, res) =>
  cardsController.findOneLatestUpdate(req, res)
);

cardsRoutes.put('/background/:cardId', upload.single('background'), (req, res) =>
  cardsController.updateBackground(req, res)
);

export { cardsRoutes };

