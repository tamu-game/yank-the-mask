"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

export const AppShellClient = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? "/";
  const isLandingRoute = pathname === "/";
  const desktopFrameClass = isLandingRoute ? "desktop-frame-login" : "";

  return (
    <AppShell hideBackground={isLandingRoute} desktopFrameClass={desktopFrameClass}>
      {children}
    </AppShell>
  );
};
