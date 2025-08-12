import { WorkspacesServiceInterface } from "@core/application/interfaces/workspaces-service-interface";
import { vi } from "vitest";

export const workspaceServiceMock = {
  save: vi.fn(),
  enable: vi.fn(),
  updateBackgroundByCode: vi.fn(),
  updateBackgroundById: vi.fn(),
  deleteBackgroundByCode: vi.fn(),
  deleteBackgroundById: vi.fn(),
  rename: vi.fn(),
  disableTree: vi.fn(),
  delete: vi.fn(),
  publish: vi.fn(),
} satisfies WorkspacesServiceInterface;
