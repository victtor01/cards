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

// src/http/routes/tasks-routes.ts
var tasks_routes_exports = {};
__export(tasks_routes_exports, {
  tasksRoutes: () => tasksRoutes
});
module.exports = __toCommonJS(tasks_routes_exports);

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

// src/core/application/validations/tasks-schemas/create-task-schema.ts
var import_zod = require("zod");
var CreateTaskSchema = import_zod.z.object({
  name: import_zod.z.string().min(1),
  startAt: import_zod.z.string(),
  hour: import_zod.z.string().nullable(),
  description: import_zod.z.string().max(255).nullable(),
  endAt: import_zod.z.string().nullable(),
  color: import_zod.z.string().nullable().optional(),
  repeat: import_zod.z.string().nullable(),
  days: import_zod.z.array(import_zod.z.number()).min(1)
}).refine((data) => {
  if (data.endAt && new Date(data.startAt) > new Date(data.endAt)) {
    throw new BadRequestException("End date must be after start date");
  }
  return true;
}, {
  message: "Invalid date range"
});

// src/core/domain/entities/task.entity.ts
var import_crypto2 = require("crypto");
var import_typeorm4 = require("typeorm");

// src/core/domain/entities/user.entity.ts
var import_crypto = require("crypto");
var import_typeorm3 = require("typeorm");

// src/core/domain/entities/workspace.entity.ts
var import_nanoid2 = require("nanoid");
var import_typeorm2 = require("typeorm");

// src/core/domain/entities/card.entity.ts
var import_nanoid = require("nanoid");
var import_typeorm = require("typeorm");
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
  (0, import_typeorm.PrimaryColumn)({ type: "varchar" })
], Card.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "varchar", nullable: true })
], Card.prototype, "title", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "text", nullable: true })
], Card.prototype, "content", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "text", nullable: true })
], Card.prototype, "background", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "varchar", nullable: true, unique: true })
], Card.prototype, "publicId", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "varchar" })
], Card.prototype, "userId", 2);
__decorateClass([
  (0, import_typeorm.ManyToOne)(() => User)
], Card.prototype, "user", 2);
__decorateClass([
  (0, import_typeorm.Column)({ type: "varchar" })
], Card.prototype, "workspaceId", 2);
__decorateClass([
  (0, import_typeorm.ManyToOne)(() => Workspace, (workspace) => workspace.workspaces, { onDelete: "CASCADE" }),
  (0, import_typeorm.JoinColumn)({ name: "workspaceId" })
], Card.prototype, "workspace", 2);
__decorateClass([
  (0, import_typeorm.CreateDateColumn)()
], Card.prototype, "createdAt", 2);
__decorateClass([
  (0, import_typeorm.UpdateDateColumn)()
], Card.prototype, "updatedAt", 2);
Card = __decorateClass([
  (0, import_typeorm.Entity)({ name: "cards" })
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
    this.id = id || (0, import_crypto.randomUUID)();
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

// src/core/domain/entities/task.entity.ts
var Task = class {
  constructor(props, id) {
    this.hour = null;
    this.color = null;
    Object.assign(this, props);
    this.startAt = props?.startAt || /* @__PURE__ */ new Date();
    this.endAt = props?.endAt || null;
    this.id = id || (0, import_crypto2.randomUUID)();
  }
};
__decorateClass([
  (0, import_typeorm4.PrimaryColumn)({ type: "varchar" })
], Task.prototype, "id", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar" })
], Task.prototype, "name", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", nullable: true })
], Task.prototype, "description", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", nullable: true })
], Task.prototype, "repeat", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "date" })
], Task.prototype, "startAt", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "date", nullable: true })
], Task.prototype, "endAt", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "simple-array", nullable: true })
], Task.prototype, "completed", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "simple-array", nullable: true })
], Task.prototype, "deleted", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "simple-array" })
], Task.prototype, "days", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "time", nullable: true })
], Task.prototype, "hour", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar", nullable: true })
], Task.prototype, "color", 2);
__decorateClass([
  (0, import_typeorm4.CreateDateColumn)()
], Task.prototype, "createdAt", 2);
__decorateClass([
  (0, import_typeorm4.Column)({ type: "varchar" })
], Task.prototype, "userId", 2);
__decorateClass([
  (0, import_typeorm4.ManyToOne)(() => User, (user) => user.tasks),
  (0, import_typeorm4.JoinColumn)({ name: "userId" })
], Task.prototype, "user", 2);
Task = __decorateClass([
  (0, import_typeorm4.Entity)({ name: "tasks" })
], Task);

// src/utils/throw-error-validation-schema.ts
function ThrowErrorInValidationSchema(error) {
  const errors = error?.errors || "errors";
  const messageErrors = errors?.map((err) => err.message) || "errros";
  throw new BadRequestException(JSON.stringify(messageErrors));
}

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

// src/infra/repositories/implements/implements-tasks.repository.ts
var import_typeorm6 = require("typeorm");
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
        startAt: (0, import_typeorm6.LessThanOrEqual)(date)
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
      startAt: (0, import_typeorm6.Or)((0, import_typeorm6.Between)(startAt, endAt), (0, import_typeorm6.LessThanOrEqual)(startAt)),
      userId,
      repeat: "weekly",
      endAt: (0, import_typeorm6.IsNull)()
    };
    const whereRepeatWeeklyButHaveEnd = {
      ...staticWhere,
      endAt: (0, import_typeorm6.Or)((0, import_typeorm6.Between)(startAt, endAt), (0, import_typeorm6.MoreThan)(endAt))
    };
    const whereRepeatWeeklyButDontHaveEnd = {
      ...staticWhere
    };
    const whereDontRepeat = {
      ...staticWhere,
      startAt: (0, import_typeorm6.Between)(startAt, endAt),
      repeat: (0, import_typeorm6.IsNull)()
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
var import_express = require("express");
var tasksRoutes = (0, import_express.Router)();
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  tasksRoutes
});
