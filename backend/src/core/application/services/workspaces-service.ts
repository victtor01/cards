import { Workspace } from '@core/domain/entities/workspace.entity';
import { WorkspacesRepository } from '@infra/repositories/workspaces.repository';
import { ThrowErrorInValidationSchema } from '@src/utils/throw-error-validation-schema';
import { CreateWorkspaceDto } from '../dtos/create-workspace-dto';
import { WorkspacesServiceInterface } from '../interfaces/workspaces-service-interface';
import { createWorkspaceSchema } from '../validations/create-workspace-schema';
import { UnauthorizedException } from '@src/utils/errors';

export class WorkspacesService implements WorkspacesServiceInterface {
  constructor(private readonly workspaceRepository: WorkspacesRepository) {}

  public async save(data: CreateWorkspaceDto): Promise<Workspace> {
    const { name, userId } = await createWorkspaceSchema
      .parseAsync(data)
      .catch((err) => ThrowErrorInValidationSchema(err));

    const workspaceToCreate = new Workspace({ name, userId });

    const workspace = await this.workspaceRepository.save(workspaceToCreate);

    return workspace;
  }

  public async findByUser(userId: string): Promise<Workspace[]> {
    return await this.workspaceRepository.findByUserId(userId);
  }

  public async findOneByCodeAndUser(code: string, userId: string): Promise<Workspace> {
    const workspace = await this.workspaceRepository.findOneByCode(code);

    if (workspace?.userId !== userId) {
      throw new UnauthorizedException('workspace not exists!');
    }

    return workspace;
  }
}
