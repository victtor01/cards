import { Workspace } from "@core/domain/entities/workspace.entity";

function mapWorkspacesById(workspaces: Workspace[]): Map<string, Workspace> {
  return workspaces.reduce((map, workspace) => {
    map.set(workspace.id, workspace);
    return map;
  }, new Map<string, Workspace>());
}

function enrichWorkspace(
  workspaceId: string,
  workspaceMap: Map<string, Workspace>,
): Workspace | null {
  const workspace = workspaceMap.get(workspaceId);

  if (!workspace) {
    return null;
  }

  workspace.workspaces = Array.from(workspaceMap.values())
    .filter((w) => w.parentId === workspaceId)
    .map((subWorkspace) => enrichWorkspace(subWorkspace.id, workspaceMap))
    .filter((ws): ws is Workspace => ws !== null);

  return workspace;
}

function buildTree(workspaces: Workspace[]): Workspace[] {
  const workspaceMap = mapWorkspacesById(workspaces);

  return Array.from(workspaceMap.values())
    .filter((workspace) => !workspace.parentId)
    .map((rootWorkspace) => enrichWorkspace(rootWorkspace.id, workspaceMap))
    .filter((ws): ws is Workspace => ws !== null);
}

export { buildTree };
