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

// src/infra/api/controllers/tasks-controller.ts
var tasks_controller_exports = {};
__export(tasks_controller_exports, {
  TasksController: () => TasksController
});
module.exports = __toCommonJS(tasks_controller_exports);

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

// src/infra/api/controllers/tasks-controller.ts
var TasksController = class {
  constructor(tasksService) {
    this.tasksService = tasksService;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  TasksController
});
