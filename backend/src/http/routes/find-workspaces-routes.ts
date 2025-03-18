import { FindWorkspacesServiceInterface } from '@core/application/interfaces/find-workspaces-interface';
import { FindWorkspacesService } from '@core/application/services/find-workspaces-service';
import { Workspace } from '@core/domain/entities/workspace.entity';
import { FindWorkspacesController } from '@infra/api/controllers/find-workspaces-controller';
import { sessionMiddleware } from '@infra/api/middlewares/session.middleware';
import { AppDataSource } from '@infra/database';
import { ImplementsWorkspacesRepository } from '@infra/repositories/implements/implements-workspaces.repository';
import { WorkspacesRepository } from '@infra/repositories/workspaces.repository';
import { Router } from 'express';
import { Repository } from 'typeorm';

export class SetupFindWorkspacesRoutes {
  private readonly findWorkspacesRoutes: Router = Router();
  private readonly findWorkspacesService: FindWorkspacesServiceInterface;
  private readonly findWorkspacesController: FindWorkspacesController;

  constructor() {
    const dataSource: Repository<Workspace> = AppDataSource.getRepository(Workspace);
    const repository: WorkspacesRepository = new ImplementsWorkspacesRepository(dataSource);
    this.findWorkspacesService = new FindWorkspacesService(repository);
    this.findWorkspacesController = new FindWorkspacesController(this.findWorkspacesService);
  }

  public setup(): Router {
    this.findWorkspacesRoutes.use(sessionMiddleware);

    this.setStaticRoutes();
    this.setDynamicRoutes();

    return this.findWorkspacesRoutes;
  }

  private setDynamicRoutes(): void {
    this.findWorkspacesRoutes.get('/:workspaceId', (req, res) =>
      this.findWorkspacesController.findById(req, res)
    );

    this.findWorkspacesRoutes.get('/code/:code', (req, res) =>
      this.findWorkspacesController.findByCode(req, res)
    );

    this.findWorkspacesRoutes.get('/tree/:workspaceId', (req, res) =>
      this.findWorkspacesController.findOneByIdWithTree(req, res)
    );
  }

  private setStaticRoutes(): void {
    this.findWorkspacesRoutes.get('/', (req, res) =>
      this.findWorkspacesController.findAll(req, res)
    );

    this.findWorkspacesRoutes.get('/tree', (req, res) =>
      this.findWorkspacesController.findWithTree(req, res)
    );

    this.findWorkspacesRoutes.get('/disabled', (req, res) =>
      this.findWorkspacesController.getDisabled(req, res)
    );
  }
}
