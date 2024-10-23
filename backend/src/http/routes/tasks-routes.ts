import { TasksService } from '@core/application/services/tasks-service';
import { Task } from '@core/domain/entities/task.entity';
import { TasksController } from '@infra/api/controllers/tasks-controller';
import { sessionMiddleware } from '@infra/api/middlewares/session.middleware';
import { AppDataSource } from '@infra/database';
import { ImplementsTasksRepository } from '@infra/repositories/implements/implements-tasks.repository';
import { Router } from 'express';

const tasksRoutes = Router();
tasksRoutes.use(sessionMiddleware);

const tasksRepository = new ImplementsTasksRepository(AppDataSource.getRepository(Task));
const tasksService = new TasksService(tasksRepository);
const tasksContoller = new TasksController(tasksService);

tasksRoutes.post('/', (req, res) => tasksContoller.create(req, res));
tasksRoutes.get('/', (req, res) => tasksContoller.findByDate(req, res));
tasksRoutes.get('/:taskId', (req, res) => tasksContoller.findOneByIdAndUser(req, res));
tasksRoutes.delete('/:taskId', (req, res) => tasksContoller.delete(req, res));
tasksRoutes.put("/:taskId", (req, res) => tasksContoller.updateTask(req, res));
tasksRoutes.put('/completed/:taskId', (req, res) => tasksContoller.updateCompletedArray(req, res));

export { tasksRoutes };

