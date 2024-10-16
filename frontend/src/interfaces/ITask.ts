export type ITask = {
  id: string;
  name: string;
  repeat: string | false;
  description: string | null;
  completed: string[];
  startAt: string | Date;
  endAt: string | Date | null;
  hour: string | Date | null;
  days: string[];
  deleted: string[];
  createdAt: Date | string;
};