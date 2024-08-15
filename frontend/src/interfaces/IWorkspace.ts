import { Card } from "../../../backend/src/core/domain/entities/card.entity";
export interface Workspace {
  id: string;
  code: string;
  name: string;
  cards: Card[];
  background?: string | null;
  workspaces: Workspace[];
}
