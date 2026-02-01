"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

export const AppShellClient = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? "/";
  const isLandingRoute = pathname === "/";
  const isFeedRoute = pathname === "/feed";
  const desktopFrameClass = isLandingRoute ? "desktop-frame-login" : "";

  return (
    <AppShell
      hideBackground={isLandingRoute}
      desktopFrameClass={desktopFrameClass}
      showAudioControl={!isFeedRoute}
    >
      {children}
    </AppShell>
  );
};
