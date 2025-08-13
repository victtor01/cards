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

// src/infra/api/controllers/workspaces-controller.ts
var workspaces_controller_exports = {};
__export(workspaces_controller_exports, {
  WorkspacesController: () => WorkspacesController
});
module.exports = __toCommonJS(workspaces_controller_exports);

// src/infra/config/constants/status.ts
var STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  NOT_IMPLEMENTED: 501,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504
};

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

// src/infra/api/controllers/workspaces-controller.ts
var WorkspacesController = class {
  constructor(workspacesService) {
    this.workspacesService = workspacesService;
  }
  async create(request, response) {
    const { id: userId } = request.session;
    const { body } = request;
    await this.workspacesService.save({ userId, ...body });
    response.status(200).json({
      error: false,
      message: "workspace success created!"
    });
  }
  async deleteBackgroundByCode(request, response) {
    const { id: userId } = request.session;
    if (!request?.params?.code) throw new BadRequestException("params not found!");
    const { code } = request.params;
    await this.workspacesService.deleteBackgroundByCode(code, userId);
    response.status(200).json({
      error: false,
      message: "updated success!"
    });
  }
  async deleteBackgroundById(request, response) {
    const { id: userId } = request.session;
    if (!request?.params?.id) throw new BadRequestException("params not found!");
    const { id } = request.params;
    await this.workspacesService.deleteBackgroundById(id, userId);
    response.status(200).json({
      error: false,
      message: "deleted success!"
    });
  }
  async rename(request, response) {
    const id = request?.params?.workspaceId || null;
    const name = request?.body?.name || null;
    const { id: userId } = request.session;
    if (!id) throw new BadRequestException("params not found!");
    await this.workspacesService.rename({ id, name }, userId);
    response.status(STATUS.OK).json({
      error: false
    });
  }
  async delete(request, response) {
    const { id: userId } = request.session;
    if (!request.params?.workspaceId) throw new BadRequestException("params not found!");
    const { workspaceId } = request.params;
    await this.workspacesService.delete(workspaceId, userId);
    response.status(200).json({ error: false });
  }
  async updateBackgroundByCode(request, response) {
    const { id: userId } = request.session;
    const {
      file: { filename: background }
    } = request;
    const { params } = request;
    if (!params?.code) {
      throw new BadRequestException("params not found!");
    }
    const { code } = params;
    const res = await this.workspacesService.updateBackgroundByCode({
      background,
      userId,
      code
    });
    return response.status(200).json(res);
  }
  async updateBackgroundById(request, response) {
    const { id: userId } = request.session;
    const {
      file: { filename: background }
    } = request;
    const { params } = request;
    if (!params?.id) {
      throw new BadRequestException("params not found!");
    }
    const { id } = params;
    const res = await this.workspacesService.updateBackgroundById({
      background,
      userId,
      id
    });
    return response.status(200).json(res);
  }
  async disableTree(request, response) {
    const { id: userId } = request.session;
    const { workspaceId } = request?.params;
    const workspaces = await this.workspacesService.disableTree(workspaceId, userId);
    response.status(200).json(workspaces);
  }
  async enable(request, response) {
    const { id: userId } = request.session;
    const workspaceId = request.params.workspaceId;
    await this.workspacesService.enable(workspaceId, userId);
    response.status(200).json({
      error: false,
      message: "update success!"
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WorkspacesController
});
