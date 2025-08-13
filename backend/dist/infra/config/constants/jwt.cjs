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

// src/infra/config/constants/jwt.ts
var jwt_exports = {};
__export(jwt_exports, {
  JwtConfig: () => JwtConfig,
  secret: () => secret
});
module.exports = __toCommonJS(jwt_exports);
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  JwtConfig,
  secret
});
