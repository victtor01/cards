import { TasksRepository } from '@infra/repositories/tasks.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTaskDto } from '../dtos/tasks-dtos/create-task-dto';
import { TasksService } from './tasks-service';

const tasksRepositoryMock = {
  save: vi.fn(),
  findByStartAndUser: vi.fn(),
} satisfies TasksRepository;

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
      repeat: false,
      days: [0],
    } satisfies CreateTaskDto;

    await tasksService.create(createTaskDto, 'EXAMPLEUSERID');

    expect(tasksRepositoryMock.save).toHaveBeenCalledTimes(1);
  });

  it('should throw error when not finding parameters', async () => {});
});
