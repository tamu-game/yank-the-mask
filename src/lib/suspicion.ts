import { gameConfig } from "@/lib/config";

export const clampSuspicion = (value: number) => {
  return Math.max(gameConfig.suspicionClamp.min, Math.min(gameConfig.suspicionClamp.max, value));
};

export const addSuspicion = (current: number, delta: number) => {
  return clampSuspicion(current + delta);
};
