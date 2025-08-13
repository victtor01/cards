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

// src/infra/api/controllers/find-workspaces-controller.ts
var find_workspaces_controller_exports = {};
__export(find_workspaces_controller_exports, {
  FindWorkspacesController: () => FindWorkspacesController
});
module.exports = __toCommonJS(find_workspaces_controller_exports);

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

// src/utils/remove-nulls.ts
function removeNulls(obj) {
  if (obj === null || obj === void 0) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => removeNulls(item));
  }
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== null && value !== void 0).map(([key, value]) => [key, removeNulls(value)])
    );
  }
  return obj;
}

// src/infra/api/mappers/card-mapper.ts
var CardMapper = class {
  static toResponse(card) {
    if (!card) return null;
    return {
      id: card?.id,
      title: card?.title,
      content: card?.content,
      background: card?.background,
      publicId: card?.publicId,
      userId: card?.userId,
      workspaceId: card?.workspaceId,
      workspace: WorkspaceMapper.toResponse(card.workspace),
      createdAt: card?.createdAt?.toISOString(),
      updatedAt: card?.updatedAt?.toISOString()
    };
  }
  static toSimpleResponse(card) {
    if (!card) return null;
    return {
      id: card?.id,
      title: card?.title,
      publicId: card?.publicId
    };
  }
};

// src/infra/api/mappers/workspace-mapper.ts
var WorkspaceMapper = class _WorkspaceMapper {
  static toResponse(workspace) {
    return {
      id: workspace.id,
      name: workspace.name,
      status: workspace.status,
      userId: workspace.userId,
      code: workspace.code,
      parentId: workspace.parentId,
      background: workspace.background,
      isPublic: workspace.isPublic,
      workspaces: workspace.workspaces?.map((ws) => _WorkspaceMapper.toSimpleResponse(ws)),
      cards: workspace.cards?.map((card) => CardMapper.toSimpleResponse(card)),
      parent: void 0
    };
  }
  static toSimpleResponse(workspace) {
    return {
      id: workspace.id,
      name: workspace.name,
      status: workspace.status,
      code: workspace.code,
      parentId: workspace.parentId,
      background: workspace.background,
      isPublic: workspace.isPublic
    };
  }
};

// src/infra/api/controllers/find-workspaces-controller.ts
var FindWorkspacesController = class {
  constructor(findWorkspaces) {
    this.findWorkspaces = findWorkspaces;
  }
  async findById(request, response) {
    const { id: userId } = request.session;
    const workspaceId = request.params.workspaceId || null;
    if (!workspaceId) throw new BadRequestException("not found workspace id");
    const workspace = await this.findWorkspaces.findOneActiveByIdAndUser(workspaceId, userId);
    const workspaceResponse = WorkspaceMapper.toResponse(workspace);
    response.status(200).json(removeNulls(workspaceResponse));
  }
  async getDisabled(request, response) {
    const { id: userId } = request.session;
    const workspaces = await this.findWorkspaces.getDisabledByUser(userId);
    response.status(200).json(workspaces);
  }
  async findWithTree(request, response) {
    const { id: userId } = request.session;
    const workspaces = await this.findWorkspaces.findByUserFormatTree(userId);
    response.status(200).json(workspaces);
  }
  async findAll(request, response) {
    const { id: userId } = request.session;
    const workspaces = await this.findWorkspaces.findByUserWithCards(userId);
    response.status(200).json(workspaces);
  }
  async findByCode(request, response) {
    const {
      session: { id: userId },
      params: { code }
    } = request;
    const workspace = await this.findWorkspaces.findOneByCodeAndUser(code, userId);
    response.status(200).json(workspace);
  }
  async findOneByIdWithTree(request, response) {
    const { id: userId } = request.session;
    const { workspaceId } = request.params;
    const workspace = await this.findWorkspaces.findOneWorkspaceWithTree(workspaceId, userId);
    response.status(200).json(WorkspaceMapper.toResponse(workspace));
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  FindWorkspacesController
});
