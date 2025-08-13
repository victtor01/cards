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

// src/core/application/utils/workspace-tree.ts
var workspace_tree_exports = {};
__export(workspace_tree_exports, {
  WorkspaceTree: () => WorkspaceTree
});
module.exports = __toCommonJS(workspace_tree_exports);
var WorkspaceTree = class {
  static build(workspaces) {
    const tree = [];
    const map = {};
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
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WorkspaceTree
});
