import { UsersService } from '@core/application/services/users-service';
import { User } from '@core/domain/entities/user.entity';
import { sessionMiddleware } from '@infra/api/middlewares/session.middleware';
import config from '@infra/config/constants/multer';
import { AppDataSource } from '@infra/database';
import { ImplementsUsersRepository } from '@infra/repositories/implements/implements-users.repository';
import { UsersController } from '@src/infra/api/controllers/users-controller';
import { Router } from 'express';
import multer from 'multer';

const usersRoutes = Router();

const upload = multer(config);
const usersRepository = new ImplementsUsersRepository(AppDataSource.getRepository(User));
const usersService = new UsersService(usersRepository, upload);
const usersController = new UsersController(usersService);

usersRoutes.post('/', (req, res) => usersController.create(req, res));

usersRoutes.use(sessionMiddleware);
usersRoutes.get('/mine', (req, res) => usersController.mine(req, res));
usersRoutes.post('/update-photo', upload.single('photo'), (req, res) =>
  usersController.uploadPhoto(req, res)
);

export { usersRoutes, usersService };
