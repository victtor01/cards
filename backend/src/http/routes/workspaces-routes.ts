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

workspacesRoutes.post('/', (req, res) => workspacesController.create(req, res));
workspacesRoutes.get('/', (req, res) => workspacesController.findAll(req, res));

workspacesRoutes.get('/tree', (req, res) => workspacesController.findWithTree(req, res));
workspacesRoutes.get('/tree/:workspaceId', (req, res) =>
  workspacesController.findOneByIdWithTree(req, res)
);

workspacesRoutes.get('/:code', (req, res) => workspacesController.findByCode(req, res));

workspacesRoutes.put('/background/:code', upload.single('background'), (req, res) =>
  workspacesController.updateBackgroundByCode(req, res)
);

export { workspacesRoutes, workspacesService };
