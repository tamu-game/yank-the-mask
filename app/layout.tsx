import type { Metadata } from "next";
import "@/styles/globals.css";
import { AppShell } from "@/components/AppShell";

export const metadata: Metadata = {
  title: "Maskle",
  description: "Swipe, match, and unmask the alien impostor."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
