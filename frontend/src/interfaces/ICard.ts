export interface ICard {
  id: string;
  title: string;
  workspaceId: string;
  content: string;
  createdAt?: string | null;
  background: string | null | undefined;
}
