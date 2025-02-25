import { WorkspacesServiceInterface } from "@core/application/interfaces/workspaces-service-interface";
import { vi } from "vitest";

export const workspaceServiceMock = {
  save: vi.fn(),
  findByUserWithCards: vi.fn(),
  findByUserFormatTree: vi.fn(),
  enable: vi.fn(),
  findOneActiveByIdAndUser: vi.fn(),
  findOneByCodeAndUser: vi.fn(),
  findOneWorkspaceWithTree: vi.fn(),
  updateBackgroundByCode: vi.fn(),
  updateBackgroundById: vi.fn(),
  deleteBackgroundByCode: vi.fn(),
  deleteBackgroundById: vi.fn(),
  rename: vi.fn(),
  disableTree: vi.fn(),
  getDisabledByUser: vi.fn(),
  delete: vi.fn(),
  findOneById: vi.fn(),
} satisfies WorkspacesServiceInterface;
