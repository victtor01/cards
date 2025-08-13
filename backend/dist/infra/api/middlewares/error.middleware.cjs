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

// src/infra/api/middlewares/error.middleware.ts
var error_middleware_exports = {};
__export(error_middleware_exports, {
  ErrorMiddleware: () => ErrorMiddleware
});
module.exports = __toCommonJS(error_middleware_exports);

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

// src/infra/api/middlewares/error.middleware.ts
function getMessageError(message) {
  let response;
  try {
    response = JSON.parse(message);
  } catch (error) {
    response = message || "Internal Server Error";
  }
  return response;
}
function ErrorMiddleware(error, _, res, next) {
  const statusCode = error?.statusCode || 500;
  const message = getMessageError(error.message) || "Erro desconhecido!";
  const errorText = error.error || "Internal Server Error";
  logger_default.error(`houve um erro: ${message}`);
  res.status(statusCode).json({
    statusCode,
    errorText,
    message
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ErrorMiddleware
});
