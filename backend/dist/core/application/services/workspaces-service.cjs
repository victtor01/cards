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
var __decorateClass = (decorators, target, key, kind) => {
  var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
  for (var i = decorators.length - 1, decorator; i >= 0; i--)
    if (decorator = decorators[i])
      result = (kind ? decorator(target, key, result) : decorator(result)) || result;
  if (kind && result) __defProp(target, key, result);
  return result;
};

// src/core/application/services/workspaces-service.ts
var workspaces_service_exports = {};
__export(workspaces_service_exports, {
  WorkspacesService: () => WorkspacesService
});
module.exports = __toCommonJS(workspaces_service_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  WorkspacesService
});
