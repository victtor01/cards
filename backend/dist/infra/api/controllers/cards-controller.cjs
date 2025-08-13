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

// src/infra/api/controllers/cards-controller.ts
var cards_controller_exports = {};
__export(cards_controller_exports, {
  CardsController: () => CardsController
});
module.exports = __toCommonJS(cards_controller_exports);

// src/utils/errors.ts
var ErrorInstance = class extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.error = "Internal server error";
    this.statusCode = statusCode;
  }
};
var NotFoundException = class extends ErrorInstance {
  constructor(message) {
    super(message, 404);
    this.error = "Not Found";
  }
};

// src/infra/api/controllers/cards-controller.ts
var CardsController = class {
  constructor(cardsService) {
    this.cardsService = cardsService;
  }
  async create(request, response) {
    const { body, session } = request;
    const { id: userId } = session;
    const created = await this.cardsService.create(body, userId);
    return response.status(201).json({
      title: created.title
    });
  }
  async findByPublicCode(request, response) {
    const { params } = request;
    const code = params?.code;
    if (!code) {
      throw new NotFoundException("C\xF3digo faltando na requisi\xE7\xE3o");
    }
    const card = await this.cardsService.findByPublicCode(code);
    response.status(200).json(card);
  }
  async supress(request, response) {
    const { params, session } = request;
    const { id: userId } = session;
    const cardId = params?.cardId;
    if (!cardId) {
      throw new NotFoundException("C\xF3digo faltando na requisi\xE7\xE3o");
    }
    await this.cardsService.supress(userId, cardId);
    response.status(200).json({ publicId: null });
  }
  async update(request, response) {
    const { body, session, params } = request;
    const { id: userId } = session;
    const cardId = params?.cardId || null;
    await this.cardsService.update(cardId, userId, body);
    response.status(200).json({
      error: false
    });
  }
  async findOneLatestUpdate(request, response) {
    const { session, params } = request;
    const { workspaceId } = params;
    const { id } = session;
    const workspace = await this.cardsService.findOneLatestUpdate(id, workspaceId);
    response.status(200).json(workspace);
  }
  async updateBackground(request, response) {
    const { file, session, params } = request;
    const { id: userId } = session;
    const { filename } = file;
    const cardId = params?.cardId || null;
    await this.cardsService.updateBackground(cardId, userId, filename);
    response.status(200).json({
      error: false
    });
  }
  async findOneById(request, response) {
    const { session, params } = request;
    const { id: userId } = session;
    const card = await this.cardsService.findOneByIdAndUser(params.cardId, userId);
    response.status(200).json(card);
  }
  async publish(request, response) {
    const { session, body } = request;
    const { id: userId } = session;
    const { cardId } = body;
    await this.cardsService.publish(userId, cardId);
    response.status(200).json({ publish: true });
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CardsController
});
