import { Task } from '@core/domain/entities/task.entity';
import { TasksRepository } from '@infra/repositories/tasks.repository';
import { NotFoundException, UnauthorizedException } from '@src/utils/errors';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTaskDto } from '../dtos/tasks-dtos/create-task-dto';
import { DeleteTaskDto } from '../dtos/tasks-dtos/delete-task-dto';
import { UpdateCompletedTaskDto } from '../dtos/tasks-dtos/update-completed-task';
import { TasksService } from './tasks-service';

const tasksRepositoryMock = {
  save: vi.fn(),
  findById: vi.fn(),
  findByStartAndUser: vi.fn(),
  delete: vi.fn(),
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

const deleteTaskDto = { taskId: '123', userId: 'THIS_USER' } satisfies DeleteTaskDto;

describe('tasks-service', () => {
  let tasksService: TasksService;

  beforeEach(() => {
    tasksService = new TasksService(tasksRepositoryMock);

    vi.resetAllMocks();
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

  it('should error trying delete task because user not have permission', async () => {
    const task = new Task({ ...taskMock, userId: 'OUTER_USER' }, deleteTaskDto.taskId);
    tasksRepositoryMock.findById.mockResolvedValue(task);

    const response = tasksService.deleteTask(deleteTaskDto);

    expect(response).rejects.toThrow(UnauthorizedException);
    expect(tasksRepositoryMock.findById).toBeCalledTimes(1);
    expect(tasksRepositoryMock.delete).toBeCalledTimes(0);
  });

  it('should error when task not found', async () => {
    tasksRepositoryMock.findById.mockResolvedValue(null);

    const response = tasksService.deleteTask(deleteTaskDto);

    expect(response).rejects.toThrow(NotFoundException);
    expect(tasksRepositoryMock.delete).toBeCalledTimes(0);
  });

  it('should delete task success', async () => {
    const task = new Task({ ...taskMock, userId: deleteTaskDto.userId }, deleteTaskDto.taskId);
    tasksRepositoryMock.findById.mockResolvedValue(task);
    tasksRepositoryMock.delete.mockResolvedValue(true);

    const response = await tasksService.deleteTask(deleteTaskDto);

    expect(response).toBe(true);
    expect(tasksRepositoryMock.delete).toBeCalledTimes(1);
  });
});
