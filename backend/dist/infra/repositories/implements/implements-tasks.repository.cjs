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

// src/infra/repositories/implements/implements-tasks.repository.ts
var implements_tasks_repository_exports = {};
__export(implements_tasks_repository_exports, {
  ImplementsTasksRepository: () => ImplementsTasksRepository
});
module.exports = __toCommonJS(implements_tasks_repository_exports);
var import_typeorm = require("typeorm");
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
        startAt: (0, import_typeorm.LessThanOrEqual)(date)
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
      startAt: (0, import_typeorm.Or)((0, import_typeorm.Between)(startAt, endAt), (0, import_typeorm.LessThanOrEqual)(startAt)),
      userId,
      repeat: "weekly",
      endAt: (0, import_typeorm.IsNull)()
    };
    const whereRepeatWeeklyButHaveEnd = {
      ...staticWhere,
      endAt: (0, import_typeorm.Or)((0, import_typeorm.Between)(startAt, endAt), (0, import_typeorm.MoreThan)(endAt))
    };
    const whereRepeatWeeklyButDontHaveEnd = {
      ...staticWhere
    };
    const whereDontRepeat = {
      ...staticWhere,
      startAt: (0, import_typeorm.Between)(startAt, endAt),
      repeat: (0, import_typeorm.IsNull)()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImplementsTasksRepository
});
