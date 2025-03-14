import { Workspace } from "@core/domain/entities/workspace.entity";

export abstract class IFindWorkspacesService {
  abstract findByUserWithCards(userId: string): Promise<Workspace[]>;
  abstract findByUserFormatTree(userId: string): Promise<Workspace[]>;
		abstract findOneActiveByIdAndUser(id: string, userId: string): Promise<Workspace>;
  abstract findOneByCodeAndUser(code: string, userId: string): Promise<Workspace>;
  abstract findOneWorkspaceWithTree(workspaceId: string, userId: string): Promise<Workspace>;
		abstract getDisabledByUser(userId: string): Promise<Workspace[]>;
		abstract findOneById(id: string): Promise<Workspace>;
	}