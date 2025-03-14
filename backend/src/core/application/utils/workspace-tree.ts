import { Workspace } from '@core/domain/entities/workspace.entity';

export class WorkspaceTree {
  public static build(workspaces: Workspace[]) {
    const tree: Workspace[] = [];
    const map: { [key: number]: Workspace } = {};

    workspaces?.forEach((node) => {
      map[node.id] = node;
      node.workspaces = [];
    });

    workspaces?.forEach((node) => {
      if (node?.parentId && map[node.parentId]) {
        map[node.parentId].workspaces.push(node);
      } else {
        tree.push(node);
      }
    });

    return tree;
  }
}
