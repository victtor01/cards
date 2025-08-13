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

// src/http/routes/index.ts
var routes_exports = {};
__export(routes_exports, {
  default: () => routes_default
});
module.exports = __toCommonJS(routes_exports);
var import_express7 = require("express");

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
  constructor(usersRepo, multer5) {
    this.usersRepo = usersRepo;
    this.multer = multer5;
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

// src/utils/logger.ts
var import_pino = __toESM(require("pino"), 1);
var logger_default = (0, import_pino.default)({
  enabled: true,
  level: "info",
  transport: {
    target: "pino-pretty",
    options: {
      colorize: true
    }
  }
});

// src/core/application/services/cards-service.ts
var import_nanoid3 = require("nanoid");

// src/core/application/validations/cards-schemas/create-card-schema.ts
var import_zod2 = require("zod");
var CreateCardValidation = import_zod2.z.object({
  title: import_zod2.z.string({ message: "title is required!" }).min(1, "expect title of card!"),
  content: import_zod2.z.string({ message: "content of card is required!" }).max(1e3 * 10).optional(),
  workspaceId: import_zod2.z.string({ message: "workspaceId is required!" }).min(1, "this card is workspace required!")
});

// src/core/application/validations/cards-schemas/update-card-schema.ts
var import_zod3 = require("zod");
var updateCardValidation = import_zod3.z.object({
  title: import_zod3.z.string().min(1).max(60).optional(),
  content: import_zod3.z.string().optional()
});

// src/core/application/services/cards-service.ts
var CardsService = class {
  constructor(cardsRepo, findWorkspacesServiceInterface) {
    this.cardsRepo = cardsRepo;
    this.findWorkspacesServiceInterface = findWorkspacesServiceInterface;
    this.MAX_TOTAL_OF_CARDS = 200;
  }
  async supress(userId, cardId) {
    const card = await this.cardsRepo.findOneById(cardId)?.catch((err) => {
      logger_default.error({ err }, "Houve um erro ao tentar pegar o card no [findByPublicCode]");
      return null;
    });
    if (!card?.id) {
      throw new NotFoundException("Card not found!");
    }
    card.validateUser(userId);
    await this.cardsRepo.update(cardId, { publicId: null });
  }
  async findByPublicCode(code) {
    const card = await this.cardsRepo.findByCode(code).catch((err) => {
      logger_default.error({ err }, "Houve um erro ao tentar pegar o card no [findByPublicCode]");
      return null;
    });
    return card;
  }
  async publish(userId, cardId) {
    const card = await this.cardsRepo.findOneById(cardId).catch((err) => {
      logger_default.error({ err }, "Houve um erro ao tentar buscar o card");
      return null;
    });
    if (!card?.id) {
      throw new NotFoundException("Card n\xE3o encontrado!");
    }
    if (card?.userId !== userId) {
      throw new BadRequestException("Card n\xE3o pertence ao usu\xE1rio");
    }
    await this.cardsRepo.update(cardId, {
      publicId: (0, import_nanoid3.nanoid)(12)
    });
  }
  async create(createCardDto, userId) {
    const data = await CreateCardValidation.parseAsync(createCardDto).catch(
      (err) => ThrowErrorInValidationSchema(err)
    );
    const { title, content, workspaceId } = data;
    const workspace = await this.findWorkspacesServiceInterface.findOneById(workspaceId);
    if (workspace?.userId !== userId) {
      throw new UnauthorizedException("you don`t permission to create this card");
    }
    const quantityOfCards = await this.cardsRepo.findAllByUser(userId);
    if (quantityOfCards?.length > this.MAX_TOTAL_OF_CARDS) {
      throw new BadRequestException("maximum number of cards exceeded");
    }
    const cardToCreate = new Card({
      workspaceId,
      content,
      userId,
      title
    });
    const card = await this.cardsRepo.save(cardToCreate);
    return card;
  }
  async findOneLatestUpdate(userId, workspaceId) {
    if (!userId) throw new BadRequestException("params not found!");
    const card = await this.cardsRepo.findOneLatestUpdateByWorkspace(userId, workspaceId);
    if (!card?.id) throw new NotFoundException("Card not found!");
    card.validateUser(userId);
    return card;
  }
  async findOneByIdAndUser(cardId, userId) {
    if (!cardId || !userId) throw new BadRequestException("params not found!");
    const card = await this.cardsRepo.findOneById(cardId);
    card.validateUser(userId);
    return card;
  }
  async update(cardId, userId, data) {
    const card = await this.findOneByIdAndUser(cardId, userId);
    if (!card) {
      throw new BadRequestException("card not found!");
    }
    const { title, content } = await updateCardValidation.parseAsync({
      title: data.title,
      content: data.content
    });
    await this.cardsRepo.update(cardId, {
      title,
      content
    });
    return true;
  }
  async updateBackground(id, userId, background) {
    const card = await this.findOneByIdAndUser(id, userId);
    if (!card?.id) {
      throw new BadRequestException("file not found!");
    }
    if (card?.userId !== userId) {
      throw new UnauthorizedException("user does not have permission!");
    }
    if (card?.background) {
      unlinkUploadFile(card.background);
    }
    await this.cardsRepo.update(id, {
      background
    });
    return true;
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

// src/infra/api/controllers/cards-controller.ts
var CardsController = class {
  constructor(cardsService) {
    this.cardsService = cardsService;
  }
  async create(request, response) {
    const { body, session } = request;
    const { id: userId } = session;
    const created = await this.cardsService.create(body, userId);
    return response.status(201).json({
      title: created.title
    });
  }
  async findByPublicCode(request, response) {
    const { params } = request;
    const code = params?.code;
    if (!code) {
      throw new NotFoundException("C\xF3digo faltando na requisi\xE7\xE3o");
    }
    const card = await this.cardsService.findByPublicCode(code);
    response.status(200).json(card);
  }
  async supress(request, response) {
    const { params, session } = request;
    const { id: userId } = session;
    const cardId = params?.cardId;
    if (!cardId) {
      throw new NotFoundException("C\xF3digo faltando na requisi\xE7\xE3o");
    }
    await this.cardsService.supress(userId, cardId);
    response.status(200).json({ publicId: null });
  }
  async update(request, response) {
    const { body, session, params } = request;
    const { id: userId } = session;
    const cardId = params?.cardId || null;
    await this.cardsService.update(cardId, userId, body);
    response.status(200).json({
      error: false
    });
  }
  async findOneLatestUpdate(request, response) {
    const { session, params } = request;
    const { workspaceId } = params;
    const { id } = session;
    const workspace = await this.cardsService.findOneLatestUpdate(id, workspaceId);
    response.status(200).json(workspace);
  }
  async updateBackground(request, response) {
    const { file, session, params } = request;
    const { id: userId } = session;
    const { filename } = file;
    const cardId = params?.cardId || null;
    await this.cardsService.updateBackground(cardId, userId, filename);
    response.status(200).json({
      error: false
    });
  }
  async findOneById(request, response) {
    const { session, params } = request;
    const { id: userId } = session;
    const card = await this.cardsService.findOneByIdAndUser(params.cardId, userId);
    response.status(200).json(card);
  }
  async publish(request, response) {
    const { session, body } = request;
    const { id: userId } = session;
    const { cardId } = body;
    await this.cardsService.publish(userId, cardId);
    response.status(200).json({ publish: true });
  }
};

// src/infra/repositories/implements/implements-cards.repository.ts
var ImplementsCardsRepository = class {
  constructor(cardsRepo) {
    this.cardsRepo = cardsRepo;
  }
  async findByCode(code) {
    return await this.cardsRepo.findOne({
      where: { publicId: code }
    });
  }
  async findAllByUser(userId) {
    return await this.cardsRepo.find({
      where: {
        userId
      }
    });
  }
  async save(card) {
    return await this.cardsRepo.save(card);
  }
  async findOneLatestUpdateByWorkspace(userId, workspaceId) {
    return await this.cardsRepo.findOne({
      order: { updatedAt: "DESC" },
      where: { userId, workspaceId }
    });
  }
  async update(id, { title, content, background, publicId }) {
    return await this.cardsRepo.update(id, { title, content, background, publicId });
  }
  async findOneById(id) {
    return await this.cardsRepo.findOneBy({ id });
  }
};

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

// src/http/routes/cards-routes.ts
var import_express3 = require("express");
var import_multer5 = __toESM(require("multer"), 1);
var SetupCardsRoutes = class {
  constructor() {
    this.cardsRoutes = (0, import_express3.Router)();
    const cardsRepository = new ImplementsCardsRepository(AppDataSource.getRepository(Card));
    const workspaceRepository = AppDataSource.getRepository(Workspace);
    const workspacesRepository = new ImplementsWorkspacesRepository(workspaceRepository);
    const findWorkspacesService = new FindWorkspacesService(workspacesRepository);
    const cardsService = new CardsService(cardsRepository, findWorkspacesService);
    this.cardsController = new CardsController(cardsService);
    this.upload = (0, import_multer5.default)(multer_default);
  }
  setup() {
    this.setPublicRoutes();
    this.setStaticRoutes();
    this.setDynamicRoutes();
    return this.cardsRoutes;
  }
  setPublicRoutes() {
    this.cardsRoutes.get(
      "/publish/:code",
      (req, res) => this.cardsController.findByPublicCode(req, res)
    );
  }
  setStaticRoutes() {
    this.cardsRoutes.use(sessionMiddleware);
    this.cardsRoutes.post("/", (req, res) => this.cardsController.create(req, res));
    this.cardsRoutes.post("/publish", (req, res) => this.cardsController.publish(req, res));
  }
  setDynamicRoutes() {
    this.cardsRoutes.get("/:cardId", (req, res) => this.cardsController.findOneById(req, res));
    this.cardsRoutes.put("/:cardId", (req, res) => this.cardsController.update(req, res));
    this.cardsRoutes.put("/supress/:cardId", (req, res) => this.cardsController.supress(req, res));
    this.cardsRoutes.get(
      "/latest/:workspaceId",
      (req, res) => this.cardsController.findOneLatestUpdate(req, res)
    );
    this.cardsRoutes.put(
      "/background/:cardId",
      this.upload.single("background"),
      (req, res) => this.cardsController.updateBackground(req, res)
    );
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

// src/http/routes/find-workspaces-routes.ts
var import_express4 = require("express");
var SetupFindWorkspacesRoutes = class {
  constructor() {
    this.findWorkspacesRoutes = (0, import_express4.Router)();
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

// src/core/application/validations/tasks-schemas/create-task-schema.ts
var import_zod4 = require("zod");
var CreateTaskSchema = import_zod4.z.object({
  name: import_zod4.z.string().min(1),
  startAt: import_zod4.z.string(),
  hour: import_zod4.z.string().nullable(),
  description: import_zod4.z.string().max(255).nullable(),
  endAt: import_zod4.z.string().nullable(),
  color: import_zod4.z.string().nullable().optional(),
  repeat: import_zod4.z.string().nullable(),
  days: import_zod4.z.array(import_zod4.z.number()).min(1)
}).refine((data) => {
  if (data.endAt && new Date(data.startAt) > new Date(data.endAt)) {
    throw new BadRequestException("End date must be after start date");
  }
  return true;
}, {
  message: "Invalid date range"
});

// src/core/application/services/tasks-service.ts
var import_class_validator2 = require("class-validator");
var import_dayjs = __toESM(require("dayjs"), 1);

// src/core/application/dtos/tasks-dtos/update-task-dto.ts
var import_class_validator = require("class-validator");
var UpdateTaskDto = class {
  constructor(props) {
    this.repeat = null;
    this.hour = null;
    Object.assign(this, props);
  }
};
__decorateClass([
  (0, import_class_validator.IsString)()
], UpdateTaskDto.prototype, "id", 2);
__decorateClass([
  (0, import_class_validator.IsString)(),
  (0, import_class_validator.MinLength)(1)
], UpdateTaskDto.prototype, "name", 2);
__decorateClass([
  (0, import_class_validator.IsString)()
], UpdateTaskDto.prototype, "description", 2);
__decorateClass([
  (0, import_class_validator.IsIn)(["weekly", null]),
  (0, import_class_validator.IsOptional)()
], UpdateTaskDto.prototype, "repeat", 2);
__decorateClass([
  (0, import_class_validator.IsString)()
], UpdateTaskDto.prototype, "startAt", 2);
__decorateClass([
  (0, import_class_validator.IsString)(),
  (0, import_class_validator.IsOptional)()
], UpdateTaskDto.prototype, "endAt", 2);
__decorateClass([
  (0, import_class_validator.IsArray)()
], UpdateTaskDto.prototype, "days", 2);
__decorateClass([
  (0, import_class_validator.IsString)(),
  (0, import_class_validator.IsOptional)()
], UpdateTaskDto.prototype, "hour", 2);

// src/core/application/services/tasks-service.ts
var TasksService = class {
  constructor(tasksRepository2) {
    this.tasksRepository = tasksRepository2;
  }
  async completeTaskDay(userId, taskId, day) {
    const task = await this.findOneById(taskId);
    if (!task?.id || task.userId !== userId) {
      throw new BadRequestException("user not have permission to update this task");
    }
    const validTask = this.isValidTaskForDate(task, (0, import_dayjs.default)(day));
    if (!validTask) {
      throw new BadRequestException("this day not pertences to task!");
    }
    validTask.completed = [...validTask.completed, day];
    await this.tasksRepository.update(task.id, validTask);
    return validTask;
  }
  async findOneById(taskId) {
    const task = await this.tasksRepository.findById(taskId);
    if (!task?.id) throw new NotFoundException("task n\xE3o existe!");
    return task;
  }
  async parseToTask(data) {
    const parse = await CreateTaskSchema.parseAsync({
      description: data?.description || null,
      hour: data?.hour || null,
      repeat: data.repeat,
      color: data.color,
      days: data.days,
      name: data.name,
      startAt: data.startAt,
      endAt: data.endAt
    }).catch((err) => ThrowErrorInValidationSchema(err));
    return parse;
  }
  async create(data, userId) {
    const parse = await this.parseToTask(data);
    const taskToCreate = new Task({ ...parse, userId });
    const task = await this.tasksRepository.save(taskToCreate);
    return task;
  }
  createDaysWithTasks(tasks, arrayOfDays) {
    const tasksWithDays = Object.fromEntries(
      arrayOfDays.map((day) => [day.format("YYYY-MM-DD"), []])
    );
    arrayOfDays.forEach((date) => {
      tasks.forEach((task) => {
        if (this.taskPertencesToday(task, date)) {
          tasksWithDays[date.format("YYYY-MM-DD")].push(task);
        }
      });
    });
    return tasksWithDays;
  }
  async findByDate({ startAt, endAt }, userId) {
    const allTasks = await this.tasksRepository.findByStartAndUser({ startAt, endAt }, userId);
    const endAtToCreate = endAt || (0, import_dayjs.default)(startAt).endOf("week").toDate();
    const days = this.createArrayFromDateToDate((0, import_dayjs.default)(startAt), (0, import_dayjs.default)(endAtToCreate));
    var createdArray = this.createDaysWithTasks(allTasks, days);
    return createdArray;
  }
  async deleteTask(data) {
    const { taskId, userId } = data;
    const task = await this.tasksRepository.findById(taskId);
    if (!task?.id) throw new NotFoundException("Task n\xE3o existe!");
    if (task.userId !== userId)
      throw new UnauthorizedException("Usu\xE1rio n\xE3o tem permiss\xE3o para excluir essa task!");
    await this.tasksRepository.delete(taskId);
    return true;
  }
  async updateArrayCompleted(updateCompletedTaskDto) {
    const { completedArray, taskId, userId } = updateCompletedTaskDto;
    const task = await this.findOneById(taskId);
    if (task?.userId !== userId) {
      throw new UnauthorizedException("Usu\xE1rio n\xE3o pode fazer essa a\xE7\xE3o!");
    }
    const days = task?.days?.map((day) => Number(day));
    const verifyDatesOfCompleted = completedArray.filter((date) => {
      const dayOfWeek = (0, import_dayjs.default)(date);
      return days?.includes(dayOfWeek.day());
    });
    await this.tasksRepository.update(taskId, { completed: verifyDatesOfCompleted });
    return true;
  }
  async findOneByIdAndUserId(taskId, userId) {
    const task = await this.findOneById(taskId);
    if (task.userId !== userId) {
      throw new UnauthorizedException("Usu\xE1rio n\xE3o tem permiss\xE3o!");
    }
    return task;
  }
  async updateTask(updateTaskDto, userId) {
    const validation = new UpdateTaskDto(updateTaskDto);
    await (0, import_class_validator2.validateOrReject)(validation);
    const task = await this.findOneById(validation.id);
    const taskToUpdate = { ...task, ...updateTaskDto };
    if (task?.userId !== userId) {
      throw new UnauthorizedException("usu\xE1rio n\xE3o tem permiss\xE3o!");
    }
    taskToUpdate.completed = updateTaskDto?.days?.every(
      (value, index) => value?.toString() === task?.days[index]?.toString()
    ) ? task.completed : [];
    await this.tasksRepository.update(task.id, taskToUpdate);
    return true;
  }
  getOldestTaskDate(tasks) {
    const oldestStart = tasks.reduce((oldestTask, task) => {
      const currentTaskDate = new Date(task.startAt);
      const oldestDate = new Date(oldestTask.startAt);
      return currentTaskDate < oldestDate ? task : oldestTask;
    }, tasks[0])?.startAt;
    return oldestStart;
  }
  isTaskInfinite(task) {
    return task.repeat === "weekly" && !task.endAt;
  }
  isCurrentDateIsAfterOrSame(currentDate, taskStartAt) {
    return currentDate.isAfter(taskStartAt) || currentDate.isSame(taskStartAt);
  }
  createArrayFromDateToDate(startAt, endAt) {
    return Array.from({ length: endAt.diff(startAt, "day") + 1 }, (_, i) => startAt.add(i, "day"));
  }
  isValidTaskForDate(task, currentDate) {
    const taskStartAt = (0, import_dayjs.default)(task.startAt);
    if (!this.isCurrentDateIsAfterOrSame(currentDate, taskStartAt)) return null;
    if (this.isTaskInfinite(task)) return task;
    const taskEndAt = task.endAt ? (0, import_dayjs.default)(task.endAt) : (0, import_dayjs.default)(task.startAt).endOf("week");
    if (currentDate.isBefore(taskEndAt, "day") || currentDate.isSame(taskEndAt, "day")) {
      return task;
    }
    return null;
  }
  taskPertencesToday(task, currentDate) {
    const { days } = task;
    const daysString = days.map((day) => day.toString());
    if (!daysString.includes(currentDate.day().toString())) {
      return null;
    }
    return this.isValidTaskForDate(task, currentDate);
  }
  isTaskDueTodayLates(task, currentDate) {
    const dayOfWeek = currentDate.day();
    const taskDays = task?.days?.map(Number);
    const currentDateFormatted = currentDate.format("YYYY-MM-DD");
    const taskIsCompleted = task?.completed?.includes(currentDateFormatted);
    if (!taskDays?.includes(dayOfWeek) || taskIsCompleted) return null;
    return this.isValidTaskForDate(task, currentDate);
  }
  processNonRepeatingTask(task, endDate) {
    const { id, startAt, days, completed, name } = task;
    const overdue = [];
    const dateStartAt = (0, import_dayjs.default)(startAt);
    const daysIndex = days.map(Number);
    const isSameWeek = endDate.startOf("week").isSame(startAt);
    const arrayOfDays = isSameWeek ? Array.from({ length: endDate.day() }, (_, i) => i) : Array.from({ length: 7 }, (_, i) => i);
    arrayOfDays.forEach((indexDay) => {
      const formattedDate = dateStartAt.set("day", indexDay).format("YYYY-MM-DD");
      const dayIndexIncludes = daysIndex.includes(indexDay);
      const completedDay = completed?.includes(formattedDate);
      if (dayIndexIncludes && !completedDay) {
        overdue.push({ id, name, date: formattedDate.toString() });
      }
    });
    return overdue;
  }
  async findLates(userId, dateString) {
    const date = dateString ? new Date(dateString) : (0, import_dayjs.default)().toDate();
    const allTasksBeforeDay = await this.tasksRepository.findLates(userId, date);
    if (!allTasksBeforeDay) return [];
    try {
      const overdueTasks = [];
      const oldestStart = this.getOldestTaskDate(allTasksBeforeDay);
      const startDate = (0, import_dayjs.default)(oldestStart);
      const endDate = (0, import_dayjs.default)(date);
      const tasksNotRepeat = allTasksBeforeDay?.filter((task) => task.repeat === null) || [];
      tasksNotRepeat?.forEach((taskNotRepeat) => {
        const process2 = this.processNonRepeatingTask(taskNotRepeat, endDate);
        overdueTasks.push(...process2);
      });
      const datesArray = this.createArrayFromDateToDate(startDate, endDate);
      const tasksRepeat = allTasksBeforeDay?.filter((task) => task.repeat === "weekly") || [];
      const overdueRepeatTasks = datesArray.flatMap(
        (currentDate) => tasksRepeat.map((task) => this.isTaskDueTodayLates(task, currentDate)).filter((repeatedTask) => !!repeatedTask).map(({ id, name }) => ({ id, name, date: currentDate.format("YYYY-MM-DD") }))
      );
      overdueTasks.push(...overdueRepeatTasks);
      return overdueTasks;
    } catch (error) {
      throw new BadRequestException("Houve um erro ao tentar buscar as tasks atrasadas!");
    }
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

// src/infra/api/controllers/tasks-controller.ts
var TasksController = class {
  constructor(tasksService2) {
    this.tasksService = tasksService2;
  }
  async create(req, res) {
    const { body } = req;
    const { id } = req.session;
    const created = await this.tasksService.create(body, id);
    return res.status(STATUS.CREATED).json(created);
  }
  async findOneByIdAndUser(request, response) {
    const { session, params } = request;
    const [taskId, userId] = [params.taskId, session.id];
    const task = await this.tasksService.findOneByIdAndUserId(taskId, userId);
    return response.status(STATUS.OK).json(task);
  }
  async completeTask(req, res) {
    const { session, params } = req;
    const { body } = req;
    if (!params?.taskId || !body?.day) {
      throw new BadRequestException("taskId not found");
    }
    const updated = await this.tasksService.completeTaskDay(session.id, params.taskId, body?.day);
    return res.status(STATUS.OK).json(updated);
  }
  async updateCompletedArray(req, res) {
    const { params, body, session } = req;
    const { id: userId } = session;
    const { arrayToConclude } = body;
    const { taskId } = params;
    const updated = await this.tasksService.updateArrayCompleted({
      completedArray: arrayToConclude,
      taskId,
      userId
    });
    return res.status(STATUS.OK).json(updated);
  }
  async delete(req, res) {
    const { params } = req;
    const { session } = req;
    const [taskId, userId] = [params.taskId, session.id];
    await this.tasksService.deleteTask({ taskId, userId });
    return res.status(STATUS.OK).json({
      error: false
    });
  }
  async updateTask(req, res) {
    const { params, session } = req;
    const [taskId, userId] = [params.taskId, session.id];
    const updateTaskDto = req.body;
    updateTaskDto.id = taskId;
    const updatedTask = await this.tasksService.updateTask(updateTaskDto, userId);
    return res.status(STATUS.OK).json(updatedTask);
  }
  async FindLates(req, res) {
    const { params } = req;
    const date = params.date;
    const userId = req.session.id;
    const tasks = await this.tasksService.findLates(userId, date);
    return res.status(STATUS.OK).json(tasks);
  }
  async findByDate(req, res) {
    const { id } = req.session;
    const query = req.query;
    const tasks = await this.tasksService.findByDate(query, id);
    return res.status(STATUS.OK).json(tasks);
  }
};

// src/infra/repositories/implements/implements-tasks.repository.ts
var import_typeorm7 = require("typeorm");
var ImplementsTasksRepository = class {
  constructor(tasksRepo) {
    this.tasksRepo = tasksRepo;
  }
  async save(task) {
    const created = await this.tasksRepo.save(task);
    return created;
  }
  async findLates(userId, date) {
    const tasks = await this.tasksRepo.find({
      where: {
        userId,
        startAt: (0, import_typeorm7.LessThanOrEqual)(date)
      }
    });
    return tasks;
  }
  async delete(taskId) {
    const deleted = await this.tasksRepo.delete(taskId);
    return deleted;
  }
  async findByStartAndUser(data, userId) {
    const { startAt, endAt } = data;
    const staticWhere = {
      startAt: (0, import_typeorm7.Or)((0, import_typeorm7.Between)(startAt, endAt), (0, import_typeorm7.LessThanOrEqual)(startAt)),
      userId,
      repeat: "weekly",
      endAt: (0, import_typeorm7.IsNull)()
    };
    const whereRepeatWeeklyButHaveEnd = {
      ...staticWhere,
      endAt: (0, import_typeorm7.Or)((0, import_typeorm7.Between)(startAt, endAt), (0, import_typeorm7.MoreThan)(endAt))
    };
    const whereRepeatWeeklyButDontHaveEnd = {
      ...staticWhere
    };
    const whereDontRepeat = {
      ...staticWhere,
      startAt: (0, import_typeorm7.Between)(startAt, endAt),
      repeat: (0, import_typeorm7.IsNull)()
    };
    const tasks = await this.tasksRepo.find({
      where: [whereRepeatWeeklyButHaveEnd, whereRepeatWeeklyButDontHaveEnd, whereDontRepeat],
      order: { name: "DESC" }
    });
    return tasks;
  }
  async update(taskId, dataToUpdate) {
    const updated = await this.tasksRepo.update(taskId, dataToUpdate);
    return updated;
  }
  async findById(taskId) {
    const task = await this.tasksRepo.findOneBy({ id: taskId });
    return task;
  }
};

// src/http/routes/tasks-routes.ts
var import_express5 = require("express");
var tasksRoutes = (0, import_express5.Router)();
tasksRoutes.use(sessionMiddleware);
var tasksRepository = new ImplementsTasksRepository(AppDataSource.getRepository(Task));
var tasksService = new TasksService(tasksRepository);
var tasksContoller = new TasksController(tasksService);
tasksRoutes.post("/", (req, res) => tasksContoller.create(req, res));
tasksRoutes.get("/", (req, res) => tasksContoller.findByDate(req, res));
tasksRoutes.get("/lates/:date?", (req, res) => tasksContoller.FindLates(req, res));
tasksRoutes.put("/completed/:taskId", (req, res) => tasksContoller.updateCompletedArray(req, res));
tasksRoutes.put("/complete/:taskId", (req, res) => tasksContoller.completeTask(req, res));
tasksRoutes.get("/:taskId", (req, res) => tasksContoller.findOneByIdAndUser(req, res));
tasksRoutes.delete("/:taskId", (req, res) => tasksContoller.delete(req, res));
tasksRoutes.put("/:taskId", (req, res) => tasksContoller.updateTask(req, res));

// src/core/application/validations/workspaces-schemas/create-workspace-schema.ts
var import_zod5 = require("zod");
var createWorkspaceSchema = import_zod5.z.object({
  name: import_zod5.z.string().min(1, "name is required field"),
  userId: import_zod5.z.string().min(1, "session not found!"),
  workspaceId: import_zod5.z.string().optional()
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

// src/http/routes/workspaces-routes.ts
var import_express6 = require("express");
var import_multer7 = __toESM(require("multer"), 1);
var upload2 = (0, import_multer7.default)(multer_default);
var WorkspacesRoutes = class {
  constructor() {
    this.workspacesRoutes = (0, import_express6.Router)();
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
      upload2.single("background"),
      (req, res) => this.workspacesController.updateBackgroundById(req, res)
    );
  }
};

// src/http/routes/index.ts
var routes = (0, import_express7.Router)();
var findWorkspacesRoutes = new SetupFindWorkspacesRoutes();
var cardsRoutes = new SetupCardsRoutes();
var workspacesRoutes = new WorkspacesRoutes();
routes.use("/users", usersRoutes);
routes.use("/auth", authRoutes);
routes.use("/workspaces", workspacesRoutes.setup());
routes.use("/workspaces/find", findWorkspacesRoutes.setup());
routes.use("/cards", cardsRoutes.setup());
routes.use("/tasks", tasksRoutes);
var routes_default = routes;
