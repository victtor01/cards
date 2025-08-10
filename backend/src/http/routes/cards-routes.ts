import { CardsService } from '@core/application/services/cards-service';
import { FindWorkspacesService } from '@core/application/services/find-workspaces-service';
import { Card } from '@core/domain/entities/card.entity';
import { Workspace } from '@core/domain/entities/workspace.entity';
import { CardsController } from '@infra/api/controllers/cards-controller';
import { sessionMiddleware } from '@infra/api/middlewares/session.middleware';
import config from '@infra/config/constants/multer';
import { AppDataSource } from '@infra/database';
import { ImplementsCardsRepository } from '@infra/repositories/implements/implements-cards.repository';
import { ImplementsWorkspacesRepository } from '@infra/repositories/implements/implements-workspaces.repository';
import { Router } from 'express';
import multer from 'multer';

export class SetupCardsRoutes {
  private readonly cardsRoutes: Router = Router();
  private readonly cardsController: CardsController;
  private readonly upload: multer.Multer;

  constructor() {
    const cardsRepository = new ImplementsCardsRepository(AppDataSource.getRepository(Card));
    const workspaceRepository = AppDataSource.getRepository(Workspace);
    const workspacesRepository = new ImplementsWorkspacesRepository(workspaceRepository);
    const findWorkspacesService = new FindWorkspacesService(workspacesRepository);
    const cardsService = new CardsService(cardsRepository, findWorkspacesService);

    this.cardsController = new CardsController(cardsService);

    this.upload = multer(config);
  }

  public setup(): Router {
    this.setPublicRoutes();
    this.setStaticRoutes();
    this.setDynamicRoutes();

    return this.cardsRoutes;
  }

  private setPublicRoutes() {
    this.cardsRoutes.get('/publish/:code', (req, res) =>
      this.cardsController.findByPublicCode(req, res)
    );
  }

  private setStaticRoutes() {
    this.cardsRoutes.use(sessionMiddleware);
    this.cardsRoutes.post('/', (req, res) => this.cardsController.create(req, res));
    this.cardsRoutes.post('/publish', (req, res) => this.cardsController.publish(req, res));
  }

  private setDynamicRoutes() {
    this.cardsRoutes.get('/:cardId', (req, res) => this.cardsController.findOneById(req, res));
    this.cardsRoutes.put('/:cardId', (req, res) => this.cardsController.update(req, res));
    this.cardsRoutes.put('/supress/:cardId', (req, res) => this.cardsController.supress(req, res));

    this.cardsRoutes.get('/latest/:workspaceId', (req, res) =>
      this.cardsController.findOneLatestUpdate(req, res)
    );

    this.cardsRoutes.put('/background/:cardId', this.upload.single('background'), (req, res) =>
      this.cardsController.updateBackground(req, res)
    );
  }
}
