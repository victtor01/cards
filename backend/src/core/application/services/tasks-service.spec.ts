import { Task } from '@core/domain/entities/task.entity';
import { TasksRepository } from '@infra/repositories/tasks.repository';
import { UnauthorizedException } from '@src/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTaskDto } from '../dtos/tasks-dtos/create-task-dto';
import { UpdateCompletedTaskDto } from '../dtos/tasks-dtos/update-completed-task';
import { TasksService } from './tasks-service';

const tasksRepositoryMock = {
  save: vi.fn(),
  findById: vi.fn(),
  findByStartAndUser: vi.fn(),
  update: vi.fn(),
} satisfies TasksRepository;

const taskMock = new Task({
  name: 'example',
  startAt: new Date(),
  endAt: new Date(),
  hour: '',
  repeat: false,
  days: [0],
});

describe('tasks-service', () => {
  let tasksService: TasksService;

  beforeEach(() => {
    tasksService = new TasksService(tasksRepositoryMock);
  });

  it('should create a new task', async () => {
    const createTaskDto = {
      name: 'example',
      startAt: new Date(),
      endAt: new Date(),
      hour: '',
      repeat: false,
      days: [0],
    } satisfies CreateTaskDto;

    await tasksService.create(createTaskDto, 'EXAMPLEUSERID');

    expect(tasksRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should error when not found task', async () => {
    tasksRepositoryMock.findById.mockResolvedValueOnce(Promise.resolve(null));

    expect(tasksService.findById('not found')).rejects.toThrow();
  });

  describe('updateCompletedTask', () => {
    it('should be an error in updateCompletedTask because the task does not belong to the user', async () => {
      const updatedTaskDataDto = {
        taskId: '123',
        userId: 'user1',
        completedArray: [],
      } satisfies UpdateCompletedTaskDto;

      tasksRepositoryMock.findById.mockResolvedValueOnce(
        Promise.resolve({ ...taskMock, userId: 'user2' })
      );

      expect(tasksService.updateArrayCompleted(updatedTaskDataDto)).rejects.toThrow(
        new UnauthorizedException('Usuário não pode fazer essa ação!')
      );
    });
  });
});
