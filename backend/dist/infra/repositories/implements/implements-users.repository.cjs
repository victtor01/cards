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

// src/infra/repositories/implements/implements-users.repository.ts
var implements_users_repository_exports = {};
__export(implements_users_repository_exports, {
  ImplementsUsersRepository: () => ImplementsUsersRepository
});
module.exports = __toCommonJS(implements_users_repository_exports);
var ImplementsUsersRepository = class {
  constructor(usersRepo) {
    this.usersRepo = usersRepo;
  }
  async save(user) {
    return await this.usersRepo.save(user);
  }
  async findOneByEmail(email) {
    return await this.usersRepo.findOneBy({
      email
    });
  }
  async findOneById(userId) {
    return await this.usersRepo.findOneBy({
      id: userId
    });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImplementsUsersRepository
});
