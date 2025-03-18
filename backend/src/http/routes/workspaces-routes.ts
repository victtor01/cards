import { WorkspacesService } from '@core/application/services/workspaces-service';
import { Workspace } from '@core/domain/entities/workspace.entity';
import { WorkspacesController } from '@infra/api/controllers/workspaces-controller';
import { sessionMiddleware } from '@infra/api/middlewares/session.middleware';
import config from '@infra/config/constants/multer';
import { AppDataSource } from '@infra/database';
import { ImplementsWorkspacesRepository } from '@infra/repositories/implements/implements-workspaces.repository';
import { Router } from 'express';
import multer from 'multer';

const upload = multer(config);
class WorkspacesRoutes {
  private readonly workspacesRoutes = Router();
  private readonly repository = AppDataSource.getRepository(Workspace);
  private workspacesRepository = new ImplementsWorkspacesRepository(this.repository);
  private workspacesService = new WorkspacesService(this.workspacesRepository);
  private workspacesController = new WorkspacesController(this.workspacesService);

  public setup(): Router {
    this.workspacesRoutes.use(sessionMiddleware);
    this.setRoutes();
    return this.workspacesRoutes;
  }

  private setRoutes(): void {
    this.workspacesRoutes.post('/', (req, res) => this.workspacesController.create(req, res));

    this.workspacesRoutes.put('/:workspaceId', (req, res) =>
      this.workspacesController.rename(req, res)
    );

    this.workspacesRoutes.delete('/:workspaceId', (req, res) =>
      this.workspacesController.delete(req, res)
    );

    this.workspacesRoutes.put('/disable/:workspaceId', (req, res) =>
      this.workspacesController.disableTree(req, res)
    );

    this.workspacesRoutes.put('/enable/:workspaceId', (req, res) =>
      this.workspacesController.enable(req, res)
    );

    this.workspacesRoutes.delete('/background/:id', (req, res) =>
      this.workspacesController.deleteBackgroundById(req, res)
    );

    this.workspacesRoutes.put('/background/:id', upload.single('background'), (req, res) =>
      this.workspacesController.updateBackgroundById(req, res)
    );
  }
}

export { WorkspacesRoutes };
