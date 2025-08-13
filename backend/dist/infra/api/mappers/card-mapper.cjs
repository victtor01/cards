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

// src/infra/api/mappers/card-mapper.ts
var card_mapper_exports = {};
__export(card_mapper_exports, {
  CardMapper: () => CardMapper
});
module.exports = __toCommonJS(card_mapper_exports);

// src/infra/api/mappers/workspace-mapper.ts
var WorkspaceMapper = class _WorkspaceMapper {
  static toResponse(workspace) {
    return {
      id: workspace.id,
      name: workspace.name,
      status: workspace.status,
      userId: workspace.userId,
      code: workspace.code,
      parentId: workspace.parentId,
      background: workspace.background,
      isPublic: workspace.isPublic,
      workspaces: workspace.workspaces?.map((ws) => _WorkspaceMapper.toSimpleResponse(ws)),
      cards: workspace.cards?.map((card) => CardMapper.toSimpleResponse(card)),
      parent: void 0
    };
  }
  static toSimpleResponse(workspace) {
    return {
      id: workspace.id,
      name: workspace.name,
      status: workspace.status,
      code: workspace.code,
      parentId: workspace.parentId,
      background: workspace.background,
      isPublic: workspace.isPublic
    };
  }
};

// src/infra/api/mappers/card-mapper.ts
var CardMapper = class {
  static toResponse(card) {
    if (!card) return null;
    return {
      id: card?.id,
      title: card?.title,
      content: card?.content,
      background: card?.background,
      publicId: card?.publicId,
      userId: card?.userId,
      workspaceId: card?.workspaceId,
      workspace: WorkspaceMapper.toResponse(card.workspace),
      createdAt: card?.createdAt?.toISOString(),
      updatedAt: card?.updatedAt?.toISOString()
    };
  }
  static toSimpleResponse(card) {
    if (!card) return null;
    return {
      id: card?.id,
      title: card?.title,
      publicId: card?.publicId
    };
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  CardMapper
});
