import { Router } from 'express';
import { authRoutes } from './auth-routes';
import { cardsRoutes } from './cards-routes';
import { tasksRoutes } from './tasks-routes';
import { usersRoutes } from './users-routers';
import { workspacesRoutes } from './workspaces-routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/auth', authRoutes);
routes.use('/workspaces', workspacesRoutes);
routes.use('/cards', cardsRoutes);
routes.use('/tasks', tasksRoutes);

export default routes;
