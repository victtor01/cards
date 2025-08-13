"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTree = buildTree;
function mapWorkspacesById(workspaces) {
    return workspaces.reduce((map, workspace) => {
        map.set(workspace.id, workspace);
        return map;
    }, new Map());
}
function enrichWorkspace(workspaceId, workspaceMap) {
    const workspace = workspaceMap.get(workspaceId);
    if (!workspace) {
        return null;
    }
    workspace.workspaces = Array.from(workspaceMap.values())
        .filter((w) => w.parentId === workspaceId)
        .map((subWorkspace) => enrichWorkspace(subWorkspace.id, workspaceMap))
        .filter((ws) => ws !== null);
    return workspace;
}
function buildTree(workspaces) {
    const workspaceMap = mapWorkspacesById(workspaces);
    return Array.from(workspaceMap.values())
        .filter((workspace) => !workspace.parentId)
        .map((rootWorkspace) => enrichWorkspace(rootWorkspace.id, workspaceMap))
        .filter((ws) => ws !== null);
}
//# sourceMappingURL=organize-tree.js.map