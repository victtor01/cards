import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkspacesServiceInterface } from '../interfaces/workspaces-interfaces/workspaces-service-interface';
import { WorkspacesRepository } from '@infra/repositories/workspaces.repository';
import { WorkspacesService } from './workspaces-service';
import { createWorkspaceSchema } from '../validations/workspaces-schemas/create-workspace-schema';
import { CreateWorkspaceDto } from '../dtos/workspaces-dtos/create-workspace-dto';
import { Workspace } from '@core/domain/entities/workspace.entity';

vi.mock('../validations/create-workspace-schema', () => ({
  createWorkspaceSchema: {
    parseAsync: vi.fn(),
  },
}));

const WorkspacesRepositoryMock = {
  save: vi.fn(),
  findByUserIdWithCards: vi.fn(),
  findOneByCodeWithWorkspacesAndCards: vi.fn(),
  findOneById: vi.fn(),
} satisfies WorkspacesRepository;

describe('worksapcesServices', () => {
  let workspaceService: WorkspacesServiceInterface;

  beforeEach(() => {
    workspaceService = new WorkspacesService(WorkspacesRepositoryMock);
  });

  it('should create workspace', async () => {
    const create = {
      name: 'exampleOfName',
      userId: 'userId',
    } satisfies CreateWorkspaceDto;

    vi.spyOn(createWorkspaceSchema, 'parseAsync').mockResolvedValue(await Promise.resolve(create));
    WorkspacesRepositoryMock.save.mockResolvedValue(await Promise.resolve(new Workspace(create)));

    const response = await workspaceService.save(create);

    expect(response).toBeInstanceOf(Workspace);
  });
});
