"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell } from "./AppShell";

export const AppShellClient = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname() ?? "/";
  const isLandingRoute = pathname === "/";

  return <AppShell hideBackground={isLandingRoute}>{children}</AppShell>;
};
