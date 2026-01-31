import { gameConfig } from "@/lib/config";

export const clampSuspicion = (value: number) => {
  return Math.max(gameConfig.suspicionClamp.min, Math.min(gameConfig.suspicionClamp.max, value));
};

export const addSuspicion = (current: number, delta: number) => {
  return clampSuspicion(current + delta);
};

export const isAlienFromAverageSuspicion = (totalSuspicion: number, answeredCount: number) => {
  if (answeredCount <= 0) {
    return false;
  }
  const averageSuspicion = totalSuspicion / answeredCount;
  return averageSuspicion > 1.5;
};
