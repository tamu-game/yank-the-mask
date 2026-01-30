import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "@/styles/globals.css";
import { AppShell } from "@/components/AppShell";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Maskle",
  description: "Swipe, match, and unmask the alien impostor."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fredoka.className}>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
