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

// src/core/application/services/auth-service.ts
var auth_service_exports = {};
__export(auth_service_exports, {
  AuthService: () => AuthService
});
module.exports = __toCommonJS(auth_service_exports);

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
  constructor(usersService, jwtService) {
    this.usersService = usersService;
    this.jwtService = jwtService;
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthService
});
