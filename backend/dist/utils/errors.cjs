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

// src/utils/errors.ts
var errors_exports = {};
__export(errors_exports, {
  BadRequestException: () => BadRequestException,
  ErrorInstance: () => ErrorInstance,
  NotFoundException: () => NotFoundException,
  UnauthorizedException: () => UnauthorizedException
});
module.exports = __toCommonJS(errors_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  BadRequestException,
  ErrorInstance,
  NotFoundException,
  UnauthorizedException
});
