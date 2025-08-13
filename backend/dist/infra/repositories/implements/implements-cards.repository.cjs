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

// src/infra/repositories/implements/implements-cards.repository.ts
var implements_cards_repository_exports = {};
__export(implements_cards_repository_exports, {
  ImplementsCardsRepository: () => ImplementsCardsRepository
});
module.exports = __toCommonJS(implements_cards_repository_exports);
var ImplementsCardsRepository = class {
  constructor(cardsRepo) {
    this.cardsRepo = cardsRepo;
  }
  async findByCode(code) {
    return await this.cardsRepo.findOne({
      where: { publicId: code }
    });
  }
  async findAllByUser(userId) {
    return await this.cardsRepo.find({
      where: {
        userId
      }
    });
  }
  async save(card) {
    return await this.cardsRepo.save(card);
  }
  async findOneLatestUpdateByWorkspace(userId, workspaceId) {
    return await this.cardsRepo.findOne({
      order: { updatedAt: "DESC" },
      where: { userId, workspaceId }
    });
  }
  async update(id, { title, content, background, publicId }) {
    return await this.cardsRepo.update(id, { title, content, background, publicId });
  }
  async findOneById(id) {
    return await this.cardsRepo.findOneBy({ id });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  ImplementsCardsRepository
});
