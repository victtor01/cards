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

// src/http/routes/auth-routes.ts
var auth_routes_exports = {};
__export(auth_routes_exports, {
  authRoutes: () => authRoutes
});
module.exports = __toCommonJS(auth_routes_exports);

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

// src/core/application/services/auth-service.ts
var import_bcryptjs = require("bcryptjs");
var AuthService = class {
  constructor(usersService2, jwtService2) {
    this.usersService = usersService2;
    this.jwtService = jwtService2;
  }
  async generateJWT(payload, expiresIn) {
    return await this.jwtService.signJWT({ payload, expiresIn });
  }
  async auth({ email, password }) {
    const user = await this.usersService.findOneByEmail(email);
    if (!user?.id) {
      throw new NotFoundException("usu\xE1rio n\xE3o encontrado!");
    }
    const passwordsCompare = await (0, import_bcryptjs.compare)(password, user.password);
    if (!passwordsCompare) {
      throw new UnauthorizedException("as senhas n\xE3o coecidem!");
    }
    try {
      const accessToken = await this.generateJWT({ id: user.id }, "10m");
      const refreshToken = await this.generateJWT({ id: user.id }, "1d");
      return {
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new BadRequestException("There was an error when trying to log in!");
    }
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

// src/infra/api/controllers/auth-controller.ts
var AuthController = class {
  constructor(authService2) {
    this.authService = authService2;
  }
  async auth(request, response) {
    const { body } = request;
    const { email, password } = body;
    const auth = await this.authService.auth({
      email,
      password
    });
    const configCookie = { httpOnly: true, secure: false };
    response.cookie("__access_token", auth.accessToken, configCookie);
    response.cookie("__refresh_token", auth.refreshToken, configCookie);
    return response.json(auth);
  }
};

// src/http/routes/auth-routes.ts
var import_express2 = require("express");

// src/core/domain/entities/user.entity.ts
var import_crypto2 = require("crypto");
var import_typeorm4 = require("typeorm");

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

// src/core/domain/entities/workspace.entity.ts
var import_nanoid2 = require("nanoid");
var import_typeorm3 = require("typeorm");

// src/core/domain/entities/card.entity.ts
var import_nanoid = require("nanoid");
var import_typeorm2 = require("typeorm");
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
  (0, import_typeorm2.PrimaryColumn)({ type: "varchar" })
], Card.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar", nullable: true })
], Card.prototype, "title", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "text", nullable: true })
], Card.prototype, "content", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "text", nullable: true })
], Card.prototype, "background", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar", nullable: true, unique: true })
], Card.prototype, "publicId", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar" })
], Card.prototype, "userId", 2);
__decorateClass([
  (0, import_typeorm2.ManyToOne)(() => User)
], Card.prototype, "user", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar" })
], Card.prototype, "workspaceId", 2);
__decorateClass([
  (0, import_typeorm2.ManyToOne)(() => Workspace, (workspace) => workspace.workspaces, { onDelete: "CASCADE" }),
  (0, import_typeorm2.JoinColumn)({ name: "workspaceId" })
], Card.prototype, "workspace", 2);
__decorateClass([
  (0, import_typeorm2.CreateDateColumn)()
], Card.prototype, "createdAt", 2);
__decorateClass([
  (0, import_typeorm2.UpdateDateColumn)()
], Card.prototype, "updatedAt", 2);
Card = __decorateClass([
  (0, import_typeorm2.Entity)({ name: "cards" })
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
  (0, import_typeorm3.PrimaryColumn)({ type: "varchar" })
], Workspace.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar" })
], Workspace.prototype, "name", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "enum", enum: WorkspaceStatus, default: "activated" /* ACTIVATED */ })
], Workspace.prototype, "status", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "uuid" })
], Workspace.prototype, "userId", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar", length: 12, unique: true })
], Workspace.prototype, "code", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar", nullable: true })
], Workspace.prototype, "parentId", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar", nullable: true })
], Workspace.prototype, "background", 2);
__decorateClass([
  (0, import_typeorm3.ManyToOne)(() => User, (user) => user.workspaces),
  (0, import_typeorm3.JoinColumn)({ name: "userId" })
], Workspace.prototype, "user", 2);
__decorateClass([
  (0, import_typeorm3.ManyToOne)(() => Workspace, (workspace) => workspace.workspaces, {
    nullable: true,
    onDelete: "SET NULL"
  }),
  (0, import_typeorm3.JoinColumn)({ name: "parentId" })
], Workspace.prototype, "parent", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "boolean", default: false })
], Workspace.prototype, "isPublic", 2);
__decorateClass([
  (0, import_typeorm3.OneToMany)(() => Workspace, (workspace) => workspace.parent, {
    onDelete: "SET NULL"
  })
], Workspace.prototype, "workspaces", 2);
__decorateClass([
  (0, import_typeorm3.OneToMany)(() => Card, (card) => card.workspace)
], Workspace.prototype, "cards", 2);
Workspace = __decorateClass([
  (0, import_typeorm3.Entity)("workspaces")
], Workspace);

// src/core/domain/entities/user.entity.ts
var User = class {
  constructor(props, id) {
    Object.assign(this, props);
    this.id = id || (0, import_crypto2.randomUUID)();
  }
};
__decorateClass([
  (0, import_typeorm4.PrimaryGeneratedColumn)("uuid")
], User.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", length: 100 })
], User.prototype, "firstName", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", length: 100 })
], User.prototype, "lastName", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", length: 100 })
], User.prototype, "email", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", length: 100 })
], User.prototype, "password", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", nullable: true })
], User.prototype, "photo", 2);
__decorateClass([
  (0, import_typeorm4.OneToMany)(() => Workspace, (workspaces) => workspaces.user)
], User.prototype, "workspaces", 2);
__decorateClass([
  (0, import_typeorm4.OneToMany)(() => Task, (task) => task.user)
], User.prototype, "tasks", 2);
User = __decorateClass([
  (0, import_typeorm4.Entity)({ name: "users" })
], User);

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

// src/core/application/services/users-service.ts
var import_bcryptjs2 = require("bcryptjs");

// src/core/application/validations/users-schemas/create-user-schema.ts
var import_zod = require("zod");
var createUserSchema = import_zod.z.object({
  firstName: import_zod.z.string().min(3, { message: "fistnamed field requires a minimum of 3 characters!" }).transform((dt) => dt.toLowerCase()),
  lastName: import_zod.z.string().min(3, { message: "lastname field requires a minimum of 6 characters!" }).transform((dt) => dt.toLowerCase()),
  email: import_zod.z.string().email({ message: "the email format is invalid!" }),
  password: import_zod.z.string({ message: "password is required!" }).min(6, { message: "password length is minimal 6!" })
});

// src/core/application/services/users-service.ts
var UsersService = class {
  constructor(usersRepo, multer3) {
    this.usersRepo = usersRepo;
    this.multer = multer3;
  }
  async findOneByEmail(email) {
    const user = await this.usersRepo.findOneByEmail(email);
    return user;
  }
  async findOneById(userId) {
    const user = await this.usersRepo.findOneById(userId);
    return user;
  }
  async updatePhoto({ userId, filename }) {
    const user = await this.findOneById(userId);
    if (!user?.id) {
      await unlinkUploadFile(filename);
      throw new BadRequestException("user(s) not exists!");
    }
    try {
      user.photo = filename;
      const saved = await this.usersRepo.save(user);
      return saved;
    } catch (error) {
      throw new BadRequestException("error when trying to update user!");
    }
  }
  async save({ firstName, lastName, email, password }) {
    const userAlreadyExists = await this.findOneByEmail(email);
    const parse = await createUserSchema.parseAsync({
      firstName,
      lastName,
      email,
      password
    }).catch((err) => ThrowErrorInValidationSchema(err));
    if (userAlreadyExists?.email) throw new UnauthorizedException("user already exists!");
    const user = new User({
      firstName: parse.firstName,
      lastName: parse.lastName,
      email: parse.email,
      password: parse.password
    });
    try {
      user.password = await (0, import_bcryptjs2.hash)(user.password, 10);
      const created = await this.usersRepo.save(user);
      return created;
    } catch (error) {
      throw new BadRequestException("There was an error trying to create a new user!");
    }
  }
};

// src/infra/api/controllers/users-controller.ts
var UsersController = class {
  constructor(usersService2) {
    this.usersService = usersService2;
  }
  async uploadPhoto(request, response) {
    const { id: userId } = request.session;
    const { file } = request;
    const { filename } = file;
    await this.usersService.updatePhoto({ userId, filename });
    return response.status(200).json({
      error: false,
      message: "photo updated"
    });
  }
  async create(request, response) {
    const { body } = request;
    const { firstName, lastName, email, password } = body;
    await this.usersService.save({
      firstName,
      password,
      lastName,
      email
    });
    return response.status(200).json({
      created: true
    });
  }
  async mine(request, response) {
    const {
      session: { id: userId }
    } = request;
    const informations = await this.usersService.findOneById(userId);
    return response.status(200).json({
      firstName: informations.firstName,
      lastName: informations.lastName,
      email: informations.email,
      photo: informations.photo
    });
  }
};

// src/infra/api/middlewares/session.middleware.ts
async function sessionMiddleware(req, res, next) {
  const jwtService2 = new JwtService();
  const { payload } = await jwtService2.getSession(req, res);
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

// src/infra/repositories/implements/implements-users.repository.ts
var ImplementsUsersRepository = class {
  constructor(usersRepo) {
    this.usersRepo = usersRepo;
  }
  async save(user) {
    return await this.usersRepo.save(user);
  }
  async findOneByEmail(email) {
    return await this.usersRepo.findOneBy({
      email
    });
  }
  async findOneById(userId) {
    return await this.usersRepo.findOneBy({
      id: userId
    });
  }
};

// src/http/routes/users-routers.ts
var import_express = require("express");
var import_multer3 = __toESM(require("multer"), 1);
var usersRoutes = (0, import_express.Router)();
var upload = (0, import_multer3.default)(multer_default);
var usersRepository = new ImplementsUsersRepository(AppDataSource.getRepository(User));
var usersService = new UsersService(usersRepository, upload);
var usersController = new UsersController(usersService);
usersRoutes.post("/", (req, res) => usersController.create(req, res));
usersRoutes.use(sessionMiddleware);
usersRoutes.get("/mine", (req, res) => usersController.mine(req, res));
usersRoutes.post(
  "/update-photo",
  upload.single("photo"),
  (req, res) => usersController.uploadPhoto(req, res)
);

// src/http/routes/auth-routes.ts
var authRoutes = (0, import_express2.Router)();
var jwtService = new JwtService();
var authService = new AuthService(usersService, jwtService);
var authController = new AuthController(authService);
authRoutes.post("/", (req, res) => authController.auth(req, res));
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  authRoutes
});
