import { Workspace } from '@core/domain/entities/workspace.entity';
import { WorkspacesRepository } from '@infra/repositories/workspaces.repository';
import { BadRequestException, NotFoundException } from '@src/utils/errors';
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
} satisfies WorkspacesRepository;

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

  describe('#publish', () => {
    it('should throw error when worksapce not found!', async () => {
      const id = 'UNIQUE_ID';
      const userId = 'USER_ID';

      workspacesRepositoryMock.findOneById.mockResolvedValue(null);

      await expect(workspaceService.publish(id, userId)).rejects.toThrowError(
        new NotFoundException('Workspace not exists!')
      );
    });
 
    it('should throw error when worksapce not belongs to user', async () => {
      const id = 'UNIQUE_ID';
      const userId = 'USER_ID';
  
      const data = {
        name: 'example',
        userId: "OUTER_USER",
      } satisfies CreateWorkspaceDto;
  
      const workspace = new Workspace(data, id);
  
      workspacesRepositoryMock.findOneById.mockResolvedValue(workspace);
  
      await expect(workspaceService.publish(id, userId)).rejects.toThrowError(
        new BadRequestException('workspace not belongs to you!')
      );
    });
  });

});
