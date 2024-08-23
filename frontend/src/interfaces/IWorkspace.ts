import { ICard } from "./ICard";

export interface Workspace {
  id: string;
  code: string;
  name: string;
  cards: ICard[];
  background?: string | null;
  workspaces: Workspace[];
}
