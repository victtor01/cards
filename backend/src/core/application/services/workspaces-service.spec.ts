import { Workspace } from '@core/domain/entities/workspace.entity';
import { WorkspacesRepository } from '@infra/repositories/workspaces.repository';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { WorkspacesServiceInterface } from '../interfaces/workspaces-interfaces/workspaces-service-interface';
import { createWorkspaceSchema } from '../validations/workspaces-schemas/create-workspace-schema';
import { WorkspacesService } from './workspaces-service';

vi.mock('../validations/create-workspace-schema', () => ({
  createWorkspaceSchema: {
    parseAsync: vi.fn(),
  },
}));

export const workspacesRepositoryMock = {
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
} satisfies Partial<WorkspacesRepository>;

describe('worksapcesServices', () => {
  let workspaceService: Partial<WorkspacesServiceInterface>;

  beforeEach(() => {
    workspaceService = new WorkspacesService(workspacesRepositoryMock);
  });

  it('should create workspace', async () => {
    const create = new Workspace({
      name: 'example',
      userId: 'userId',
    });

    vi.spyOn(createWorkspaceSchema, 'parseAsync').mockResolvedValue(await Promise.resolve(create));
    workspacesRepositoryMock.save.mockResolvedValue(await Promise.resolve(new Workspace(create)));

    const response = await workspaceService.save(create);

    expect(response).toBeInstanceOf(Workspace);
  });
});
