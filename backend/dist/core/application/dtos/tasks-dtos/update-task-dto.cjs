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

// src/core/application/dtos/tasks-dtos/update-task-dto.ts
var update_task_dto_exports = {};
__export(update_task_dto_exports, {
  UpdateTaskDto: () => UpdateTaskDto
});
module.exports = __toCommonJS(update_task_dto_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UpdateTaskDto
});
