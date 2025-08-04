import { Session } from "@infra/config/constants/session";

declare global {
  namespace Express {
    export interface Request {
      session: Partial<Session>
    }
  }
}