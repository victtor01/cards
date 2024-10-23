import { Workspace } from '@core/domain/entities/workspace.entity';
import { WorkspacesRepository } from '@infra/repositories/workspaces.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateWorkspaceDto } from '../dtos/workspaces-dtos/create-workspace-dto';
import { WorkspacesServiceInterface } from '../interfaces/workspaces-service-interface';
import { createWorkspaceSchema } from '../validations/workspaces-schemas/create-workspace-schema';
import { WorkspacesService } from './workspaces-service';

vi.mock('../validations/create-workspace-schema', () => ({
  createWorkspaceSchema: {
    parseAsync: vi.fn(),
  },
}));

const WorkspacesRepositoryMock = {
  save: vi.fn(),
  findActivesByUserIdWithCards: vi.fn(),
  findOneByCodeWithWorkspacesAndCards: vi.fn(),
  findByParentId: vi.fn(),
  findOneById: vi.fn(),
  findOneActiveByIdWithRelations: vi.fn(),
  findByRootsWithUser: vi.fn(),
  findDisabledByUser: vi.fn(),
  update: vi.fn(),
  updateMany: vi.fn(),
  delete: vi.fn(),
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
