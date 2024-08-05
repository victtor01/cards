import { Workspace } from "@core/domain/entities/workspace.entity";
import { CreateWorkspaceDto } from "../dtos/create-workspace-dto";

export abstract class WorkspacesServiceInterface {
  abstract save(data: CreateWorkspaceDto): Promise<Workspace>
}