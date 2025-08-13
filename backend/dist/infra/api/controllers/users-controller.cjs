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

// src/infra/api/controllers/users-controller.ts
var users_controller_exports = {};
__export(users_controller_exports, {
  UsersController: () => UsersController
});
module.exports = __toCommonJS(users_controller_exports);
var UsersController = class {
  constructor(usersService) {
    this.usersService = usersService;
  }
  async uploadPhoto(request, response) {
    const { id: userId } = request.session;
    const { file } = request;
    const { filename } = file;
    await this.usersService.updatePhoto({ userId, filename });
    return response.status(200).json({
      error: false,
      message: "photo updated"
    });
  }
  async create(request, response) {
    const { body } = request;
    const { firstName, lastName, email, password } = body;
    await this.usersService.save({
      firstName,
      password,
      lastName,
      email
    });
    return response.status(200).json({
      created: true
    });
  }
  async mine(request, response) {
    const {
      session: { id: userId }
    } = request;
    const informations = await this.usersService.findOneById(userId);
    return response.status(200).json({
      firstName: informations.firstName,
      lastName: informations.lastName,
      email: informations.email,
      photo: informations.photo
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  UsersController
});
