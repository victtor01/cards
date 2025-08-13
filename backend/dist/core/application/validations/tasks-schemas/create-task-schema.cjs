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

// src/core/application/validations/tasks-schemas/create-task-schema.ts
var create_task_schema_exports = {};
__export(create_task_schema_exports, {
  CreateTaskSchema: () => CreateTaskSchema
});
module.exports = __toCommonJS(create_task_schema_exports);

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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateTaskSchema
});
