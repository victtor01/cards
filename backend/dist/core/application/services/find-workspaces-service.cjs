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

// src/core/application/services/find-workspaces-service.ts
var find_workspaces_service_exports = {};
__export(find_workspaces_service_exports, {
  FindWorkspacesService: () => FindWorkspacesService
});
module.exports = __toCommonJS(find_workspaces_service_exports);

// src/utils/errors.ts
var ErrorInstance = class extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.error = "Internal server error";
    this.statusCode = statusCode;
  }
};
var BadRequestException = class extends ErrorInstance {
  constructor(message) {
    super(message, 401);
    this.error = "Bad Request";
  }
};
var UnauthorizedException = class extends ErrorInstance {
  constructor(message) {
    super(message, 401);
    this.error = "Unauthorized";
  }
};

// src/core/application/utils/workspace-tree.ts
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

// src/core/application/services/find-workspaces-service.ts
var FindWorkspacesService = class {
  constructor(workspaceRepository) {
    this.workspaceRepository = workspaceRepository;
  }
  async findByUserWithCards(userId) {
    const workspaces = await this.workspaceRepository.findActivesByUserIdWithCards(userId);
    return workspaces;
  }
  async findByUserFormatTree(userId) {
    const workspaces = await this.workspaceRepository.findActivesByUserIdWithCards(userId);
    if (!workspaces?.length) return [];
    return WorkspaceTree.build(workspaces);
  }
  async findOneActiveByIdAndUser(id, userId) {
    const workspace = await this.workspaceRepository.findOneActiveByIdWithRelations(id);
    if (workspace?.userId !== userId) {
      throw new UnauthorizedException("workspace not exists!");
    }
    return workspace;
  }
  async findOneByCodeAndUser(code, userId) {
    const workspace = await this.workspaceRepository.findOneByCodeWithWorkspacesAndCards(code);
    if (workspace?.userId !== userId) {
      throw new UnauthorizedException("workspace not exists!");
    }
    return workspace;
  }
  async findOneWorkspaceWithTree(workspaceId, userId) {
    const workspaces = await this.workspaceRepository.findActivesByUserIdWithCards(
      userId
    );
    const rootWorkspace = workspaces.find((ws) => ws.id === workspaceId);
    if (!rootWorkspace) throw new BadRequestException("Workspace not found");
    const workspaceMap = /* @__PURE__ */ new Map();
    workspaces.forEach((workspace) => {
      workspace.workspaces = [];
      workspaceMap.set(workspace.id, workspace);
    });
    workspaces.forEach((workspace) => {
      if (workspace.parentId) {
        const parentWorkspace = workspaceMap.get(workspace.parentId);
        if (parentWorkspace) {
          parentWorkspace.workspaces.push(workspaceMap.get(workspace.id));
        }
      }
    });
    return workspaceMap.get(rootWorkspace.id);
  }
  async getDisabledByUser(userId) {
    const workspaces = await this.workspaceRepository.findDisabledByUser(userId);
    return workspaces;
  }
  async findOneById(workspaceId) {
    return await this.workspaceRepository.findOneById(workspaceId);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FindWorkspacesService
});
