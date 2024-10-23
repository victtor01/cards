import { Task } from '@core/domain/entities/task.entity';
import { TasksRepository } from '@infra/repositories/tasks.repository';
import { NotFoundException, UnauthorizedException } from '@src/utils/errors';
import { DeleteResult } from 'typeorm';
import { beforeEach, describe, expect, it, Mocked, vi } from 'vitest';
import { DeleteTaskDto } from '../dtos/tasks-dtos/delete-task-dto';
import { UpdateCompletedTaskDto } from '../dtos/tasks-dtos/update-completed-task';
import { TasksServiceInterface } from '../interfaces/task-service-interface';
import { TasksService } from './tasks-service';

const taskMock = new Task({
  name: 'example',
  description: 'This is a description',
  startAt: '2024-10-23',
  endAt: '2024-10-23',
  hour: '',
  repeat: false,
  days: [0],
});

const deleteTaskDto = { taskId: '123', userId: 'THIS_USER' } satisfies DeleteTaskDto;

describe('tasks-service', () => {
  let tasksService: TasksServiceInterface;
  let tasksRepositoryMock: Mocked<TasksRepository>;

  beforeEach(() => {
    tasksRepositoryMock = {
      save: vi.fn(),
      findById: vi.fn(),
      findByStartAndUser: vi.fn(),
      delete: vi.fn(),
      update: vi.fn(),
    } satisfies TasksRepository;

    tasksService = new TasksService(tasksRepositoryMock);
  });

  it('should error when not found task', async () => {
    tasksRepositoryMock.findById.mockResolvedValueOnce(null);

    expect(tasksService.findOneById('TASKID')).rejects.toThrow(NotFoundException);
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
      const USERID = "USER1";
      const copyTask = { ...taskMock };
      delete copyTask.name;

      vi.spyOn(tasksService, 'parseToTask');

      expect(tasksService.create(copyTask, USERID)).rejects.toThrow()
      expect(tasksRepositoryMock.save).toBeCalledTimes(0);
      expect(tasksService.parseToTask).toBeCalledTimes(1);
    });
  });

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

  describe("#updateTask", () => {
    it("should give an error trying to update the task because task does not belong to the user" , async () => {
    });

    it("should update task success", async () => {

    })
  })
});
