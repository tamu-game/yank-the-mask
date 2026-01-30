import type { Session } from "@/types/game";
import type { StorageAdapter } from "@/store/adapter";

type GlobalStore = typeof globalThis & {
  __maskleSessions?: Map<string, Session>;
};

const globalStore = globalThis as GlobalStore;

const sessionMap = globalStore.__maskleSessions ?? new Map<string, Session>();

globalStore.__maskleSessions = sessionMap;

export const memoryStore: StorageAdapter = {
  async createSession(session) {
    sessionMap.set(session.id, session);
  },
  async getSession(id) {
    return sessionMap.get(id) ?? null;
  },
  async updateSession(session) {
    sessionMap.set(session.id, session);
  }
};
