import { ICard } from "./ICard";

export interface IWorkspace {
  id: string;
  code: string;
  name: string;
  cards: ICard[];
  background?: string | null;
  workspaces: IWorkspace[];
}
