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

const workspacesRoutes = Router();
const repository = AppDataSource.getRepository(Workspace);
const workspacesRepository = new ImplementsWorkspacesRepository(repository);
const workspacesService = new WorkspacesService(workspacesRepository);
const workspacesController = new WorkspacesController(workspacesService);

workspacesRoutes.use(sessionMiddleware);

{
  workspacesRoutes.post('/', (req, res) => workspacesController.create(req, res));
  workspacesRoutes.get('/', (req, res) => workspacesController.findAll(req, res));
  workspacesRoutes.get('/tree', (req, res) => workspacesController.findWithTree(req, res));
  workspacesRoutes.get('/disabled', (req, res) => workspacesController.getDisabled(req, res));
  workspacesRoutes.get('/code/:code', (req, res) => workspacesController.findByCode(req, res));

  workspacesRoutes.put('/disable/:workspaceId', (req, res) =>
    workspacesController.disableTree(req, res)
  );

  workspacesRoutes.put('/enable/:workspaceId', (req, res) =>
    workspacesController.enable(req, res)
  );

  workspacesRoutes.get('/tree/:workspaceId', (req, res) =>
    workspacesController.findOneByIdWithTree(req, res)
  );
}

{
  workspacesRoutes.get('/:workspaceId', (req, res) => workspacesController.findById(req, res));
  workspacesRoutes.delete('/:workspaceId', (req, res) => workspacesController.delete(req, res));
  workspacesRoutes.put('/:workspaceId', (req, res) => workspacesController.rename(req, res));
}

{
  workspacesRoutes.put('/background/code/:code', upload.single('background'), (req, res) =>
    workspacesController.updateBackgroundByCode(req, res)
  );

  workspacesRoutes.delete('/background/code/:code', (req, res) =>
    workspacesController.deleteBackgroundByCode(req, res)
  );

  workspacesRoutes.delete('/background/id/:id', (req, res) =>
    workspacesController.deleteBackgroundById(req, res)
  );

  workspacesRoutes.put('/background/id/:id', upload.single('background'), (req, res) =>
    workspacesController.updateBackgroundById(req, res)
  );
}

export { workspacesRoutes, workspacesService };

