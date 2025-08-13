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

// src/utils/remove-nulls.ts
var remove_nulls_exports = {};
__export(remove_nulls_exports, {
  removeNulls: () => removeNulls
});
module.exports = __toCommonJS(remove_nulls_exports);
function removeNulls(obj) {
  if (obj === null || obj === void 0) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => removeNulls(item));
  }
  if (typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== null && value !== void 0).map(([key, value]) => [key, removeNulls(value)])
    );
  }
  return obj;
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  removeNulls
});
