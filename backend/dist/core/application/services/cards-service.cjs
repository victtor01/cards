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

// src/core/application/services/cards-service.ts
var cards_service_exports = {};
__export(cards_service_exports, {
  CardsService: () => CardsService
});
module.exports = __toCommonJS(cards_service_exports);

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
var import_nanoid2 = require("nanoid");
var import_typeorm4 = require("typeorm");

// src/core/domain/entities/user.entity.ts
var import_crypto2 = require("crypto");
var import_typeorm3 = require("typeorm");

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
var import_nanoid = require("nanoid");
var import_typeorm2 = require("typeorm");
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
    this.code = (0, import_nanoid.nanoid)(12);
    this.id = id || (0, import_nanoid.nanoid)(12);
  }
  isOwner(userId) {
    return userId === this?.userId || userId === this?.user?.id;
  }
};
__decorateClass([
  (0, import_typeorm2.PrimaryColumn)({ type: "varchar" })
], Workspace.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar" })
], Workspace.prototype, "name", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "enum", enum: WorkspaceStatus, default: "activated" /* ACTIVATED */ })
], Workspace.prototype, "status", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "uuid" })
], Workspace.prototype, "userId", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar", length: 12, unique: true })
], Workspace.prototype, "code", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar", nullable: true })
], Workspace.prototype, "parentId", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "varchar", nullable: true })
], Workspace.prototype, "background", 2);
__decorateClass([
  (0, import_typeorm2.ManyToOne)(() => User, (user) => user.workspaces),
  (0, import_typeorm2.JoinColumn)({ name: "userId" })
], Workspace.prototype, "user", 2);
__decorateClass([
  (0, import_typeorm2.ManyToOne)(() => Workspace, (workspace) => workspace.workspaces, {
    nullable: true,
    onDelete: "SET NULL"
  }),
  (0, import_typeorm2.JoinColumn)({ name: "parentId" })
], Workspace.prototype, "parent", 2);
__decorateClass([
  (0, import_typeorm2.Column)({ type: "boolean", default: false })
], Workspace.prototype, "isPublic", 2);
__decorateClass([
  (0, import_typeorm2.OneToMany)(() => Workspace, (workspace) => workspace.parent, {
    onDelete: "SET NULL"
  })
], Workspace.prototype, "workspaces", 2);
__decorateClass([
  (0, import_typeorm2.OneToMany)(() => Card, (card) => card.workspace)
], Workspace.prototype, "cards", 2);
Workspace = __decorateClass([
  (0, import_typeorm2.Entity)("workspaces")
], Workspace);

// src/core/domain/entities/user.entity.ts
var User = class {
  constructor(props, id) {
    Object.assign(this, props);
    this.id = id || (0, import_crypto2.randomUUID)();
  }
};
__decorateClass([
  (0, import_typeorm3.PrimaryGeneratedColumn)("uuid")
], User.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar", length: 100 })
], User.prototype, "firstName", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar", length: 100 })
], User.prototype, "lastName", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar", length: 100 })
], User.prototype, "email", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar", length: 100 })
], User.prototype, "password", 2);
__decorateClass([
  (0, import_typeorm3.Column)({ type: "varchar", nullable: true })
], User.prototype, "photo", 2);
__decorateClass([
  (0, import_typeorm3.OneToMany)(() => Workspace, (workspaces) => workspaces.user)
], User.prototype, "workspaces", 2);
__decorateClass([
  (0, import_typeorm3.OneToMany)(() => Task, (task) => task.user)
], User.prototype, "tasks", 2);
User = __decorateClass([
  (0, import_typeorm3.Entity)({ name: "users" })
], User);

// src/core/domain/entities/card.entity.ts
var Card = class {
  validateUser(userId) {
    if (userId !== this.userId) {
      throw new UnauthorizedException("this card does not pertences to user");
    }
  }
  constructor(data, id, publicId) {
    this.id = id || (0, import_nanoid2.nanoid)(12);
    this.publicId = publicId || (0, import_nanoid2.nanoid)(12);
    Object.assign(this, data);
  }
};
__decorateClass([
  (0, import_typeorm4.PrimaryColumn)({ type: "varchar" })
], Card.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", nullable: true })
], Card.prototype, "title", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "text", nullable: true })
], Card.prototype, "content", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "text", nullable: true })
], Card.prototype, "background", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", nullable: true, unique: true })
], Card.prototype, "publicId", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar" })
], Card.prototype, "userId", 2);
__decorateClass([
  (0, import_typeorm4.ManyToOne)(() => User)
], Card.prototype, "user", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar" })
], Card.prototype, "workspaceId", 2);
__decorateClass([
  (0, import_typeorm4.ManyToOne)(() => Workspace, (workspace) => workspace.workspaces, { onDelete: "CASCADE" }),
  (0, import_typeorm4.JoinColumn)({ name: "workspaceId" })
], Card.prototype, "workspace", 2);
__decorateClass([
  (0, import_typeorm4.CreateDateColumn)()
], Card.prototype, "createdAt", 2);
__decorateClass([
  (0, import_typeorm4.UpdateDateColumn)()
], Card.prototype, "updatedAt", 2);
Card = __decorateClass([
  (0, import_typeorm4.Entity)({ name: "cards" })
], Card);

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

// src/core/application/services/cards-service.ts
var import_nanoid3 = require("nanoid");

// src/core/application/validations/cards-schemas/create-card-schema.ts
var import_zod = require("zod");
var CreateCardValidation = import_zod.z.object({
  title: import_zod.z.string({ message: "title is required!" }).min(1, "expect title of card!"),
  content: import_zod.z.string({ message: "content of card is required!" }).max(1e3 * 10).optional(),
  workspaceId: import_zod.z.string({ message: "workspaceId is required!" }).min(1, "this card is workspace required!")
});

// src/core/application/validations/cards-schemas/update-card-schema.ts
var import_zod2 = require("zod");
var updateCardValidation = import_zod2.z.object({
  title: import_zod2.z.string().min(1).max(60).optional(),
  content: import_zod2.z.string().optional()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CardsService
});
