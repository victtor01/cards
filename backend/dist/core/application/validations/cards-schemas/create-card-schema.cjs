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

// src/core/application/validations/cards-schemas/create-card-schema.ts
var create_card_schema_exports = {};
__export(create_card_schema_exports, {
  CreateCardValidation: () => CreateCardValidation
});
module.exports = __toCommonJS(create_card_schema_exports);
var import_zod = require("zod");
var CreateCardValidation = import_zod.z.object({
  title: import_zod.z.string({ message: "title is required!" }).min(1, "expect title of card!"),
  content: import_zod.z.string({ message: "content of card is required!" }).max(1e3 * 10).optional(),
  workspaceId: import_zod.z.string({ message: "workspaceId is required!" }).min(1, "this card is workspace required!")
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CreateCardValidation
});
