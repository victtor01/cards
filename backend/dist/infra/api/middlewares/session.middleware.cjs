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

// src/infra/api/middlewares/session.middleware.ts
var session_middleware_exports = {};
__export(session_middleware_exports, {
  sessionMiddleware: () => sessionMiddleware
});
module.exports = __toCommonJS(session_middleware_exports);

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
var UnauthorizedException = class extends ErrorInstance {
  constructor(message) {
    super(message, 401);
    this.error = "Unauthorized";
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  sessionMiddleware
});
