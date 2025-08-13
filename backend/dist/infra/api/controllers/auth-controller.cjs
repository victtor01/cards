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

// src/infra/api/controllers/auth-controller.ts
var auth_controller_exports = {};
__export(auth_controller_exports, {
  AuthController: () => AuthController
});
module.exports = __toCommonJS(auth_controller_exports);
var AuthController = class {
  constructor(authService) {
    this.authService = authService;
  }
  async auth(request, response) {
    const { body } = request;
    const { email, password } = body;
    const auth = await this.authService.auth({
      email,
      password
    });
    const configCookie = { httpOnly: true, secure: false };
    response.cookie("__access_token", auth.accessToken, configCookie);
    response.cookie("__refresh_token", auth.refreshToken, configCookie);
    return response.json(auth);
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthController
});
