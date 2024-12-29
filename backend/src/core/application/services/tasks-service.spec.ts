import { Task } from '@core/domain/entities/task.entity';
import { TasksRepository } from '@infra/repositories/tasks.repository';
import { NotFoundException, UnauthorizedException } from '@src/utils/errors';
import dayjs from 'dayjs';
import { DeleteResult } from 'typeorm';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import { DeleteTaskDto } from '../dtos/tasks-dtos/delete-task-dto';
import { UpdateCompletedTaskDto } from '../dtos/tasks-dtos/update-completed-task';
import { UpdateTaskDto } from '../dtos/tasks-dtos/update-task-dto';
import { TasksServiceInterface } from '../interfaces/task-service-interface';
import { TasksService } from './tasks-service';

const taskMock = new Task({
  name: 'example',
  description: 'This is a description',
  startAt: '2024-10-23',
  endAt: '2024-10-23',
  hour: '',
  color: null,
  repeat: null,
  days: [0],
});

const updateTaskDtoMock = {
  id: 'EXAMPLETASKID',
  name: 'TASKEXAMPLE',
  days: [0],
  repeat: 'weekly',
  startAt: '2024-10-10',
  description: '',
  endAt: null,
  hour: null,
} satisfies UpdateTaskDto;

const deleteTaskDto = { taskId: '123', userId: 'THIS_USER' } satisfies DeleteTaskDto;

describe('tasks-service', () => {
  let tasksService: TasksServiceInterface;
  let tasksRepositoryMock: Mocked<TasksRepository>;

  beforeEach(() => {
    tasksRepositoryMock = {
      save: vi.fn(),
      findById: vi.fn(),
      findByStartAndUser: vi.fn(),
      findLates: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    } satisfies TasksRepository;

    tasksService = new TasksService(tasksRepositoryMock);
  });

  describe('#create', () => {
    it('should create a new task', async () => {
      const userIdMock = 'USERID';
      const task = new Task({ ...taskMock, userId: userIdMock });
      tasksRepositoryMock.save.mockResolvedValueOnce(task);

      vi.spyOn(tasksService, 'parseToTask');
      const created = await tasksService.create(taskMock, userIdMock);

      expect(tasksRepositoryMock.save).toHaveBeenCalledTimes(1);
      expect(tasksService.parseToTask).toHaveBeenCalledTimes(1);
      expect(created).toBeInstanceOf(Task);
    });

    it('should error in create a new task because of data', async () => {
      const USERID = 'USER1';
      const copyTask = { ...taskMock };
      delete copyTask.name;

      vi.spyOn(tasksService, 'parseToTask');

      expect(tasksService.create(copyTask, USERID)).rejects.toThrow();
      expect(tasksRepositoryMock.save).toBeCalledTimes(0);
      expect(tasksService.parseToTask).toBeCalledTimes(1);
    });
  });

  describe('#updateArrayCompleted', () => {
    it('should be an error in updateCompletedTask because the task does not belong to the user', async () => {
      const updatedTaskDataDto = {
        taskId: '123',
        userId: 'user1',
        completedArray: [],
      } satisfies UpdateCompletedTaskDto;

      tasksRepositoryMock.findById.mockResolvedValueOnce(
        await Promise.resolve({ ...taskMock, userId: 'user2' })
      );

      expect(tasksService.updateArrayCompleted(updatedTaskDataDto)).rejects.toThrow(
        new UnauthorizedException('Usuário não pode fazer essa ação!')
      );
    });
  });

  describe('#deleteTask', () => {
    it('should error trying delete task because user not have permission', async () => {
      const task = new Task({ ...taskMock, userId: 'OUTER_USER' }, deleteTaskDto.taskId);
      tasksRepositoryMock.findById.mockResolvedValueOnce(task);

      const response = tasksService.deleteTask(deleteTaskDto);

      expect(response).rejects.toThrow(UnauthorizedException);
      expect(tasksRepositoryMock.findById).toBeCalledTimes(1);
      expect(tasksRepositoryMock.delete).toBeCalledTimes(0);
    });

    it('should error when task not found', async () => {
      tasksRepositoryMock.findById.mockResolvedValueOnce(null);

      const response = tasksService.deleteTask(deleteTaskDto);

      expect(response).rejects.toThrow(NotFoundException);
      expect(tasksRepositoryMock.delete).toBeCalledTimes(0);
    });

    it('should delete task success', async () => {
      const task = new Task({ ...taskMock, userId: deleteTaskDto.userId }, deleteTaskDto.taskId);
      tasksRepositoryMock.findById.mockResolvedValueOnce(task);
      tasksRepositoryMock.delete.mockResolvedValueOnce((await Promise.resolve({})) as DeleteResult);

      const response = await tasksService.deleteTask(deleteTaskDto);

      expect(response).toBe(true);
      expect(tasksRepositoryMock.delete).toBeCalledTimes(1);
    });
  });

  describe('#findByIdAndUser', () => {
    it('should error when trying to get a task and the user does not have permission', async () => {
      const taskIdMock = 'TASK_ID';
      const task = new Task({ ...taskMock, userId: 'USER1' }, taskIdMock);

      tasksRepositoryMock.findById.mockResolvedValueOnce(task);

      const response = tasksService.findOneByIdAndUserId(taskIdMock, 'USER2');

      expect(response).rejects.toThrow(UnauthorizedException);
      expect(tasksRepositoryMock.findById).toBeCalledTimes(1);
    });

    it('should success on get task by ID', async () => {
      const taskIdMock = 'TASK_ID';
      const userIdMock = 'USER1';
      const task = new Task({ ...taskMock, userId: userIdMock }, taskIdMock);

      tasksRepositoryMock.findById.mockResolvedValueOnce(task);

      const response = await tasksService.findOneByIdAndUserId(taskIdMock, userIdMock);

      expect(tasksRepositoryMock.findById).toBeCalledTimes(1);
      expect(response).toBe(task);
      expect(response).toBeInstanceOf(Task);
    });
  });

  describe('#updateTask', () => {
    it('should give an error trying to update the task because task does not belong to the user', async () => {
      const userIdMock = 'USERIDMOMCK';

      tasksRepositoryMock.findById.mockResolvedValueOnce({ ...taskMock, userId: 'OUTER_USER' });

      await expect(tasksService.updateTask(updateTaskDtoMock, userIdMock)).rejects.toThrow(
        UnauthorizedException
      );
      expect(tasksRepositoryMock.findById).toBeCalledTimes(1);
      expect(tasksRepositoryMock.update).toBeCalledTimes(0);
    });

    it('should update task success', async () => {
      const userIdMock = 'USERIDMOMCK';
      const updatedDto = { ...taskMock, userId: userIdMock };

      tasksRepositoryMock.findById.mockResolvedValue(updatedDto);

      const updated = await tasksService.updateTask(updatedDto, userIdMock);

      expect(updated).toBeDefined();
      expect(tasksRepositoryMock.findById).toBeCalledTimes(1);
      expect(tasksRepositoryMock.update).toBeCalledTimes(1);
    });

    it('shoud giva an error trying to update the task because task not exists', async () => {
      const userIdMock = 'USERIDMOCK';
      const updateDto = { ...taskMock, userId: userIdMock };

      tasksRepositoryMock.findById.mockResolvedValue(null);

      const updated = tasksService.updateTask(updateDto, userIdMock);

      await expect(updated).rejects.toThrow(NotFoundException);
      expect(tasksRepositoryMock.findById).toBeCalledTimes(1);
    });
  });

  describe('#findLates', () => {
    it('should get oldest tasks', async () => {
      const oldestDate = dayjs().subtract(1, 'day');
      const tasksMocks = [{ startAt: new Date() }, { startAt: oldestDate.toISOString() }] as Task[];

      const oldestTask = tasksService.getOldestTaskDate(tasksMocks);

      expect(oldestTask).toBeDefined();
      expect(oldestTask).toBe(oldestDate.toISOString());
    });
  });

  describe('#isTaskDueToday', () => {
    it('should show task in day', () =>  {
      taskMock.startAt = dayjs().subtract(1, "week").format('YYYY-MM-DD');
      taskMock.endAt = dayjs().add(1, 'week').format('YYYY-MM-DD');
      taskMock.days = [0, 1, 2, 3, 4, 5, 6];
      taskMock.completed = [];
      taskMock.repeat = 'weekly';

      const res = tasksService.isTaskDueTodayLates(taskMock, dayjs().subtract(1, "day"))

      expect(res).toBeDefined();
      expect(res).toBe(taskMock)
    });
  });
});
