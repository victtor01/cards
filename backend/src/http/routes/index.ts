import { Router } from 'express';
import { authRoutes } from './auth-routes';
import { SetupCardsRoutes } from './cards-routes';
import { SetupFindWorkspacesRoutes } from './find-workspaces-routes';
import { tasksRoutes } from './tasks-routes';
import { usersRoutes } from './users-routers';
import { WorkspacesRoutes } from './workspaces-routes';

const routes = Router();

const findWorkspacesRoutes = new SetupFindWorkspacesRoutes();
const cardsRoutes = new SetupCardsRoutes();
const workspacesRoutes = new WorkspacesRoutes();

routes.use('/users', usersRoutes);
routes.use('/auth', authRoutes);
routes.use('/workspaces', workspacesRoutes.setup());
routes.use('/workspaces/find', findWorkspacesRoutes.setup());
routes.use('/cards', cardsRoutes.setup());
routes.use('/tasks', tasksRoutes);

export default routes;
