import { CardsRepository } from "@infra/repositories/cards.repository";
import { vi } from "vitest";

export const cardsRepositoryMock = {
  save: vi.fn(),
  update: vi.fn(),
  findOneLatestUpdateByWorkspace: vi.fn(),
  findOneById: vi.fn(),
} satisfies CardsRepository;
