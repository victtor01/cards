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

// src/http/routes/find-workspaces-routes.ts
var find_workspaces_routes_exports = {};
__export(find_workspaces_routes_exports, {
  SetupFindWorkspacesRoutes: () => SetupFindWorkspacesRoutes
});
module.exports = __toCommonJS(find_workspaces_routes_exports);

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

// src/core/domain/entities/workspace.entity.ts
var import_nanoid2 = require("nanoid");
var import_typeorm4 = require("typeorm");

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

// src/infra/database/index.ts
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);
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
  entities: [import_path.default.join(__dirname, "/../../dist/**/*.entity.{js,ts}")],
  // Mudança para dist/
  migrations: [import_path.default.join(__dirname, "/dist/migrations/*.{js,ts}")],
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

// src/http/routes/find-workspaces-routes.ts
var import_express = require("express");
var SetupFindWorkspacesRoutes = class {
  constructor() {
    this.findWorkspacesRoutes = (0, import_express.Router)();
    const dataSource = AppDataSource.getRepository(Workspace);
    const repository = new ImplementsWorkspacesRepository(dataSource);
    this.findWorkspacesService = new FindWorkspacesService(repository);
    this.findWorkspacesController = new FindWorkspacesController(this.findWorkspacesService);
  }
  setup() {
    this.findWorkspacesRoutes.use(sessionMiddleware);
    this.setStaticRoutes();
    this.setDynamicRoutes();
    return this.findWorkspacesRoutes;
  }
  setDynamicRoutes() {
    this.findWorkspacesRoutes.get(
      "/:workspaceId",
      (req, res) => this.findWorkspacesController.findById(req, res)
    );
    this.findWorkspacesRoutes.get(
      "/code/:code",
      (req, res) => this.findWorkspacesController.findByCode(req, res)
    );
    this.findWorkspacesRoutes.get(
      "/tree/:workspaceId",
      (req, res) => this.findWorkspacesController.findOneByIdWithTree(req, res)
    );
  }
  setStaticRoutes() {
    this.findWorkspacesRoutes.get(
      "/",
      (req, res) => this.findWorkspacesController.findAll(req, res)
    );
    this.findWorkspacesRoutes.get(
      "/tree",
      (req, res) => this.findWorkspacesController.findWithTree(req, res)
    );
    this.findWorkspacesRoutes.get(
      "/disabled",
      (req, res) => this.findWorkspacesController.getDisabled(req, res)
    );
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SetupFindWorkspacesRoutes
});
