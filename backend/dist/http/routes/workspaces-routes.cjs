var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/http/routes/workspaces-routes.ts
var workspaces_routes_exports = {};
__export(workspaces_routes_exports, {
  WorkspacesRoutes: () => WorkspacesRoutes
});
module.exports = __toCommonJS(workspaces_routes_exports);

// src/core/domain/entities/workspace.entity.ts
var import_nanoid2 = require("nanoid");
var import_typeorm4 = require("typeorm");

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
var NotFoundException = class extends ErrorInstance {
  constructor(message) {
    super(message, 404);
    this.error = "Not Found";
  }
};
var UnauthorizedException = class extends ErrorInstance {
  constructor(message) {
    super(message, 401);
    this.error = "Unauthorized";
  }
};

// src/core/domain/entities/card.entity.ts
var import_nanoid = require("nanoid");
var import_typeorm3 = require("typeorm");

// src/core/domain/entities/user.entity.ts
var import_crypto2 = require("crypto");
var import_typeorm2 = require("typeorm");

// src/core/domain/entities/task.entity.ts
var import_crypto = require("crypto");
var import_typeorm = require("typeorm");
var Task = class {
  constructor(props, id) {
    this.hour = null;
    this.color = null;
    Object.assign(this, props);
    this.startAt = props?.startAt || /* @__PURE__ */ new Date();
    this.endAt = props?.endAt || null;
    this.id = id || (0, import_crypto.randomUUID)();
  }
};
__decorateClass([
  (0, import_typeorm.PrimaryColumn)({ type: "varchar" })
], Task.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "varchar" })
], Task.prototype, "name", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "varchar", nullable: true })
], Task.prototype, "description", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "varchar", nullable: true })
], Task.prototype, "repeat", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "date" })
], Task.prototype, "startAt", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "date", nullable: true })
], Task.prototype, "endAt", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "simple-array", nullable: true })
], Task.prototype, "completed", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "simple-array", nullable: true })
], Task.prototype, "deleted", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "simple-array" })
], Task.prototype, "days", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "time", nullable: true })
], Task.prototype, "hour", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "varchar", nullable: true })
], Task.prototype, "color", 2);
__decorateClass([
  (0, import_typeorm.CreateDateColumn)()
], Task.prototype, "createdAt", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "varchar" })
], Task.prototype, "userId", 2);
__decorateClass([
  (0, import_typeorm.ManyToOne)(() => User, (user) => user.tasks),
  (0, import_typeorm.JoinColumn)({ name: "userId" })
], Task.prototype, "user", 2);
Task = __decorateClass([
  (0, import_typeorm.Entity)({ name: "tasks" })
], Task);

// src/core/domain/entities/user.entity.ts
var User = class {
  constructor(props, id) {
    Object.assign(this, props);
    this.id = id || (0, import_crypto2.randomUUID)();
  }
};
__decorateClass([
  (0, import_typeorm2.PrimaryGeneratedColumn)("uuid")
], User.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar", length: 100 })
], User.prototype, "firstName", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar", length: 100 })
], User.prototype, "lastName", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar", length: 100 })
], User.prototype, "email", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar", length: 100 })
], User.prototype, "password", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar", nullable: true })
], User.prototype, "photo", 2);
__decorateClass([
  (0, import_typeorm2.OneToMany)(() => Workspace, (workspaces) => workspaces.user)
], User.prototype, "workspaces", 2);
__decorateClass([
  (0, import_typeorm2.OneToMany)(() => Task, (task) => task.user)
], User.prototype, "tasks", 2);
User = __decorateClass([
  (0, import_typeorm2.Entity)({ name: "users" })
], User);

// src/core/domain/entities/card.entity.ts
var Card = class {
  validateUser(userId) {
    if (userId !== this.userId) {
      throw new UnauthorizedException("this card does not pertences to user");
    }
  }
  constructor(data, id, publicId) {
    this.id = id || (0, import_nanoid.nanoid)(12);
    this.publicId = publicId || (0, import_nanoid.nanoid)(12);
    Object.assign(this, data);
  }
};
__decorateClass([
  (0, import_typeorm3.PrimaryColumn)({ type: "varchar" })
], Card.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar", nullable: true })
], Card.prototype, "title", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "text", nullable: true })
], Card.prototype, "content", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "text", nullable: true })
], Card.prototype, "background", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar", nullable: true, unique: true })
], Card.prototype, "publicId", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar" })
], Card.prototype, "userId", 2);
__decorateClass([
  (0, import_typeorm3.ManyToOne)(() => User)
], Card.prototype, "user", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar" })
], Card.prototype, "workspaceId", 2);
__decorateClass([
  (0, import_typeorm3.ManyToOne)(() => Workspace, (workspace) => workspace.workspaces, { onDelete: "CASCADE" }),
  (0, import_typeorm3.JoinColumn)({ name: "workspaceId" })
], Card.prototype, "workspace", 2);
__decorateClass([
  (0, import_typeorm3.CreateDateColumn)()
], Card.prototype, "createdAt", 2);
__decorateClass([
  (0, import_typeorm3.UpdateDateColumn)()
], Card.prototype, "updatedAt", 2);
Card = __decorateClass([
  (0, import_typeorm3.Entity)({ name: "cards" })
], Card);

// src/core/domain/entities/workspace.entity.ts
var WorkspaceStatus = /* @__PURE__ */ ((WorkspaceStatus2) => {
  WorkspaceStatus2["DISABLED"] = "disabled";
  WorkspaceStatus2["ACTIVATED"] = "activated";
  return WorkspaceStatus2;
})(WorkspaceStatus || {});
var Workspace = class {
  constructor(props, id) {
    this.parentId = null;
    this.isPublic = false;
    Object.assign(this, props);
    this.code = (0, import_nanoid2.nanoid)(12);
    this.id = id || (0, import_nanoid2.nanoid)(12);
  }
  isOwner(userId) {
    return userId === this?.userId || userId === this?.user?.id;
  }
};
__decorateClass([
  (0, import_typeorm4.PrimaryColumn)({ type: "varchar" })
], Workspace.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar" })
], Workspace.prototype, "name", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "enum", enum: WorkspaceStatus, default: "activated" /* ACTIVATED */ })
], Workspace.prototype, "status", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "uuid" })
], Workspace.prototype, "userId", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", length: 12, unique: true })
], Workspace.prototype, "code", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", nullable: true })
], Workspace.prototype, "parentId", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", nullable: true })
], Workspace.prototype, "background", 2);
__decorateClass([
  (0, import_typeorm4.ManyToOne)(() => User, (user) => user.workspaces),
  (0, import_typeorm4.JoinColumn)({ name: "userId" })
], Workspace.prototype, "user", 2);
__decorateClass([
  (0, import_typeorm4.ManyToOne)(() => Workspace, (workspace) => workspace.workspaces, {
    nullable: true,
    onDelete: "SET NULL"
  }),
  (0, import_typeorm4.JoinColumn)({ name: "parentId" })
], Workspace.prototype, "parent", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "boolean", default: false })
], Workspace.prototype, "isPublic", 2);
__decorateClass([
  (0, import_typeorm4.OneToMany)(() => Workspace, (workspace) => workspace.parent, {
    onDelete: "SET NULL"
  })
], Workspace.prototype, "workspaces", 2);
__decorateClass([
  (0, import_typeorm4.OneToMany)(() => Card, (card) => card.workspace)
], Workspace.prototype, "cards", 2);
Workspace = __decorateClass([
  (0, import_typeorm4.Entity)("workspaces")
], Workspace);

// src/utils/throw-error-validation-schema.ts
function ThrowErrorInValidationSchema(error) {
  const errors = error?.errors || "errors";
  const messageErrors = errors?.map((err) => err.message) || "errros";
  throw new BadRequestException(JSON.stringify(messageErrors));
}

// src/utils/unlink.ts
var import_promises = require("fs/promises");
var import_path = require("path");
async function unlinkUploadFile(filename) {
  try {
    const filePath = (0, import_path.join)(__dirname, "..", "uploads", filename);
    await (0, import_promises.unlink)(filePath);
  } catch (error) {
    console.log(error);
  }
}

// src/core/application/validations/workspaces-schemas/create-workspace-schema.ts
var import_zod = require("zod");
var createWorkspaceSchema = import_zod.z.object({
  name: import_zod.z.string().min(1, "name is required field"),
  userId: import_zod.z.string().min(1, "session not found!"),
  workspaceId: import_zod.z.string().optional()
});

// src/core/application/services/workspaces-service.ts
var WorkspacesService = class {
  constructor(workspaceRepository) {
    this.workspaceRepository = workspaceRepository;
  }
  async findOneByCodeAndUser(code, userId) {
    const workspace = await this.workspaceRepository.findOneByCodeWithWorkspacesAndCards(code);
    if (workspace?.userId !== userId) {
      throw new UnauthorizedException("workspace not exists!");
    }
    return workspace;
  }
  async publish(id, userId) {
    const workspace = await this.workspaceRepository.findOneById(id);
    if (!workspace?.id) {
      throw new NotFoundException("Workspace not exists!");
    }
    const isOwner = workspace.isOwner(userId);
    if (!isOwner) throw new BadRequestException("workspace not belongs to you!");
    await this.workspaceRepository.update(id, { isPublic: true });
    return true;
  }
  async save(data) {
    const { name, userId } = await createWorkspaceSchema.parseAsync(data).catch((err) => ThrowErrorInValidationSchema(err));
    const parentId = data?.parentId || null;
    const workspaceToCreate = new Workspace({ name, userId });
    const workspaceParent = !!data?.parentId ? await this.workspaceRepository.findOneById(parentId) : null;
    if (workspaceParent?.id && workspaceParent?.userId === userId) {
      workspaceToCreate.parentId = parentId;
    }
    const workspace = await this.workspaceRepository.save(workspaceToCreate);
    return workspace;
  }
  async rename({ id, name }, userId) {
    const workspace = await this.workspaceRepository.findOneActiveByIdWithRelations(id);
    if (!workspace?.id || workspace?.userId !== userId) {
      throw new NotFoundException("workspace not found!");
    }
    if (workspace?.userId !== userId) {
      throw new UnauthorizedException("user not does permission!");
    }
    await this.workspaceRepository.update(id, { name });
    return true;
  }
  async updateBackgroundByCode(data) {
    if (!data?.code) throw new BadRequestException("Params not found to udpate background!");
    const { code, background, userId } = data;
    const workspace = await this.workspaceRepository.findOneByCodeWithWorkspacesAndCards(code);
    if (!workspace?.id || userId !== workspace?.userId)
      throw new BadRequestException("workspace not found!");
    await this.workspaceRepository.update(workspace.id, {
      background
    });
    if (workspace.background) unlinkUploadFile(workspace.background);
    return true;
  }
  async disableTree(workspaceId, userId) {
    const parent = await this.workspaceRepository.findOneById(workspaceId);
    if (!parent?.id) {
      throw new BadRequestException("Workspace not found!");
    }
    const allWorkspaces = await this.workspaceRepository.findActivesByUserIdWithCards(userId);
    const workspacesToDisable = /* @__PURE__ */ new Set([parent]);
    const collectChildren = (parentId) => {
      allWorkspaces.filter((workspace) => workspace.parentId === parentId).forEach((child) => {
        workspacesToDisable.add(child);
        if (child?.id) collectChildren(child.id);
      });
    };
    collectChildren(parent.id);
    const idsToDisable = Array.from(workspacesToDisable, (workspace) => workspace.id);
    await this.workspaceRepository.updateMany(idsToDisable, {
      status: "disabled" /* DISABLED */
    });
    return true;
  }
  async enable(workspaceId, userId) {
    const workspace = await this.workspaceRepository.findOneById(workspaceId);
    if (workspace?.userId !== userId || !workspace?.id) {
      throw new UnauthorizedException("not found workspace!");
    }
    await this.workspaceRepository.update(workspaceId, {
      status: "activated" /* ACTIVATED */
    });
    return true;
  }
  async updateBackgroundById(data) {
    if (!data?.id) throw new BadRequestException("Params not found to udpate background!");
    const { id, background, userId } = data;
    const workspace = await this.workspaceRepository.findOneById(id);
    if (!workspace?.id) throw new BadRequestException("workspace not found!");
    if (workspace?.userId !== userId) throw new UnauthorizedException("workspace not found!");
    await this.workspaceRepository.update(workspace.id, {
      background
    });
    if (workspace.background) unlinkUploadFile(workspace.background);
    return true;
  }
  async deleteBackgroundByCode(code, userId) {
    const workspace = await this.findOneByCodeAndUser(code, userId);
    unlinkUploadFile(workspace.background);
    await this.workspaceRepository.update(workspace.id, {
      background: null
    });
    return true;
  }
  async deleteBackgroundById(id, userId) {
    const workspace = await this.workspaceRepository.findOneById(id);
    if (workspace?.userId !== userId) throw new UnauthorizedException("workspace not found!");
    unlinkUploadFile(workspace.background);
    await this.workspaceRepository.update(workspace.id, {
      background: null
    });
    return true;
  }
  async delete(id, userId) {
    const workspace = await this.workspaceRepository.findOneById(id);
    if (workspace?.userId !== userId) throw new UnauthorizedException("user don`t permission!");
    if (workspace?.background) unlinkUploadFile(workspace.background);
    await this.workspaceRepository.delete(id);
    return true;
  }
  async deleteWithTree(id, userId) {
    const workspace = await this.workspaceRepository.findOneById(id);
    if (workspace?.userId !== userId) throw new UnauthorizedException("user don`t permission!");
    if (workspace?.cards) {
      const { cards } = workspace;
      cards.forEach((element) => {
        unlinkUploadFile(element.background);
      });
    }
    if (workspace?.background) {
      unlinkUploadFile(workspace.background);
    }
    await this.workspaceRepository.delete(id);
    return true;
  }
};

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

// src/infra/config/constants/jwt.ts
var secret = new TextEncoder().encode("your-secret-key");
var JwtConfig = class {
  constructor() {
    this.secretKey = "EXAMPLE_KEY";
    this.accessTokenExpiration = "12s";
    this.refreshTokenExpiration = "1d";
    this.getSecretKey = () => this.secretKey;
    this.getAccessTokenExpiration = () => this.accessTokenExpiration;
    this.getRefreshTokenExpiration = () => this.refreshTokenExpiration;
  }
};

// src/core/application/services/jwt-service.ts
var import_jose = require("jose");
var cookiesConfig = {
  accessToken: "__access_token",
  refreshToken: "__refresh_token"
};
var JwtService = class {
  constructor() {
    this.verifyJWT = async (token) => await (0, import_jose.jwtVerify)(token, secret);
    this.configCookie = { httpOnly: true, secure: false };
  }
  async signJWT({ payload, expiresIn }) {
    return await new import_jose.SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(expiresIn).sign(secret);
  }
  async renewTokenWithPassportOrThrowError(refreshToken) {
    try {
      const { payload } = await this.verifyJWT(refreshToken);
      const newAccessToken = await this.signJWT({
        payload: { id: payload.id },
        expiresIn: new JwtConfig().getAccessTokenExpiration()
      });
      return newAccessToken;
    } catch (error) {
      throw new BadRequestException("session expired!");
    }
  }
  async getSession(request, response) {
    const { cookies } = request;
    if (!cookies?.[cookiesConfig.accessToken] || !cookies?.[cookiesConfig.refreshToken]) {
      throw new UnauthorizedException("unauthorized session!");
    }
    const { __access_token, __refresh_token } = cookies;
    const session = await this.verifyJWT(__access_token).catch(async () => {
      const newToken = await this.renewTokenWithPassportOrThrowError(__refresh_token);
      response.cookie(cookiesConfig.accessToken, newToken, this.configCookie);
      const payload = await this.verifyJWT(newToken);
      return payload;
    }).catch((err) => {
      throw new UnauthorizedException(err.message);
    });
    return session;
  }
};

// src/infra/api/middlewares/session.middleware.ts
async function sessionMiddleware(req, res, next) {
  const jwtService = new JwtService();
  const { payload } = await jwtService.getSession(req, res);
  if (!payload?.id) {
    throw new UnauthorizedException("unauthorized user!");
  }
  const session = { id: payload.id };
  req.session = session;
  next();
}

// src/infra/config/constants/multer.ts
var import_multer = __toESM(require("multer"), 1);
var import_node_crypto = require("crypto");
var import_path2 = __toESM(require("path"), 1);
var folder = import_path2.default.resolve(__dirname, "..", "..", "..", "uploads");
var config = {
  dest: folder,
  storage: import_multer.default.diskStorage({
    destination: folder,
    filename(_, file, callback) {
      const fileHash = (0, import_node_crypto.randomUUID)();
      const fileName = `${fileHash}-${file.originalname}`;
      return callback(null, fileName);
    }
  })
};
var multer_default = config;

// src/infra/database/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path3 = __toESM(require("path"), 1);
var import_typeorm5 = require("typeorm");
import_dotenv.default.config();
var AppDataSource = new import_typeorm5.DataSource({
  type: process.env.DB_TYPE,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  synchronize: false,
  logging: false,
  entities: [import_path3.default.join(__dirname, "/../../dist/**/*.entity.{js,ts}")],
  // Mudança para dist/
  migrations: [import_path3.default.join(__dirname, "/dist/migrations/*.{js,ts}")],
  // Mudança para dist/
  subscribers: []
});

// src/infra/repositories/implements/implements-workspaces.repository.ts
var import_typeorm6 = require("typeorm");
var ImplementsWorkspacesRepository = class {
  constructor(workspace) {
    this.workspace = workspace;
  }
  async save({ id, name, userId, code, parentId }) {
    return await this.workspace.save({ id, name, userId, code, parentId });
  }
  async findActivesByUserIdWithCards(userId) {
    return await this.workspace.find({
      where: { status: "activated" /* ACTIVATED */, userId },
      relations: {
        cards: true
      }
    });
  }
  async findDisabledByUser(userId) {
    return await this.workspace.find({
      where: { status: "disabled" /* DISABLED */, userId },
      relations: { cards: true, workspaces: true },
      select: {
        id: true,
        name: true
      }
    });
  }
  async updateMany(ids, data) {
    return await this.workspace.update(ids, data);
  }
  async delete(id) {
    return await this.workspace.delete({ id });
  }
  async update(id, data) {
    return await this.workspace.update(id, data);
  }
  async findOneByCodeWithWorkspacesAndCards(code) {
    return await this.workspace.findOne({
      where: { code },
      relations: {
        workspaces: true,
        cards: true
      }
    });
  }
  async findOneById(workspaceId) {
    return await this.workspace.findOneBy({
      id: workspaceId
    });
  }
  async findOneActiveByIdWithRelations(workspaceId) {
    return await this.workspace.createQueryBuilder("workspace").leftJoinAndSelect(
      "workspace.workspaces",
      "childWorkspaces",
      "childWorkspaces.status = :status",
      { status: "activated" /* ACTIVATED */ }
    ).leftJoinAndSelect("workspace.cards", "cards").where("workspace.id = :workspaceId", { workspaceId }).getOne();
  }
  async findByRootsWithUser(userId) {
    return await this.workspace.find({
      where: { userId, parentId: (0, import_typeorm6.IsNull)() }
    });
  }
  async findByParentId(parentId) {
    return await this.workspace.find({
      where: { parentId }
    });
  }
};

// src/http/routes/workspaces-routes.ts
var import_express = require("express");
var import_multer3 = __toESM(require("multer"), 1);
var upload = (0, import_multer3.default)(multer_default);
var WorkspacesRoutes = class {
  constructor() {
    this.workspacesRoutes = (0, import_express.Router)();
    this.repository = AppDataSource.getRepository(Workspace);
    this.workspacesRepository = new ImplementsWorkspacesRepository(this.repository);
    this.workspacesService = new WorkspacesService(this.workspacesRepository);
    this.workspacesController = new WorkspacesController(this.workspacesService);
  }
  setup() {
    this.workspacesRoutes.use(sessionMiddleware);
    this.setRoutes();
    return this.workspacesRoutes;
  }
  setRoutes() {
    this.workspacesRoutes.post("/", (req, res) => this.workspacesController.create(req, res));
    this.workspacesRoutes.put(
      "/:workspaceId",
      (req, res) => this.workspacesController.rename(req, res)
    );
    this.workspacesRoutes.delete(
      "/:workspaceId",
      (req, res) => this.workspacesController.delete(req, res)
    );
    this.workspacesRoutes.put(
      "/disable/:workspaceId",
      (req, res) => this.workspacesController.disableTree(req, res)
    );
    this.workspacesRoutes.put(
      "/enable/:workspaceId",
      (req, res) => this.workspacesController.enable(req, res)
    );
    this.workspacesRoutes.delete(
      "/background/:id",
      (req, res) => this.workspacesController.deleteBackgroundById(req, res)
    );
    this.workspacesRoutes.put(
      "/background/:id",
      upload.single("background"),
      (req, res) => this.workspacesController.updateBackgroundById(req, res)
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WorkspacesRoutes
});
