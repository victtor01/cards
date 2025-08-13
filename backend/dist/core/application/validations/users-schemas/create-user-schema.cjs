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

// src/core/application/validations/users-schemas/create-user-schema.ts
var create_user_schema_exports = {};
__export(create_user_schema_exports, {
  createUserSchema: () => createUserSchema
});
module.exports = __toCommonJS(create_user_schema_exports);
var import_zod = require("zod");
var createUserSchema = import_zod.z.object({
  firstName: import_zod.z.string().min(3, { message: "fistnamed field requires a minimum of 3 characters!" }).transform((dt) => dt.toLowerCase()),
  lastName: import_zod.z.string().min(3, { message: "lastname field requires a minimum of 6 characters!" }).transform((dt) => dt.toLowerCase()),
  email: import_zod.z.string().email({ message: "the email format is invalid!" }),
  password: import_zod.z.string({ message: "password is required!" }).min(6, { message: "password length is minimal 6!" })
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createUserSchema
});
