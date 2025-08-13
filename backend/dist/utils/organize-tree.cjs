var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/utils/organize-tree.ts
var organize_tree_exports = {};
__export(organize_tree_exports, {
  buildTree: () => buildTree
});
module.exports = __toCommonJS(organize_tree_exports);
function mapWorkspacesById(workspaces) {
  return workspaces.reduce((map, workspace) => {
    map.set(workspace.id, workspace);
    return map;
  }, /* @__PURE__ */ new Map());
}
function enrichWorkspace(workspaceId, workspaceMap) {
  const workspace = workspaceMap.get(workspaceId);
  if (!workspace) {
    return null;
  }
  workspace.workspaces = Array.from(workspaceMap.values()).filter((w) => w.parentId === workspaceId).map((subWorkspace) => enrichWorkspace(subWorkspace.id, workspaceMap)).filter((ws) => ws !== null);
  return workspace;
}
function buildTree(workspaces) {
  const workspaceMap = mapWorkspacesById(workspaces);
  return Array.from(workspaceMap.values()).filter((workspace) => !workspace.parentId).map((rootWorkspace) => enrichWorkspace(rootWorkspace.id, workspaceMap)).filter((ws) => ws !== null);
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  buildTree
});
