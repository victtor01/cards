import { Router } from 'express';
import { authRoutes } from './auth-routes';
import { usersRoutes } from './users-routers';
import { workspacesRoutes } from './workspaces-routes';
import { cardsRoutes } from './cards-routes';

const routes = Router();

routes.use('/users', usersRoutes);
routes.use('/auth', authRoutes);
routes.use('/workspaces', workspacesRoutes);
routes.use('/cards', cardsRoutes);

export default routes;
