import type { Session } from "@/types/game";

export interface StorageAdapter {
  createSession(session: Session): Promise<void>;
  getSession(id: string): Promise<Session | null>;
  updateSession(session: Session): Promise<void>;
}
