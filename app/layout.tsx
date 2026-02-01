import type { Metadata } from "next";
import { Fredoka } from "next/font/google";
import "@/styles/globals.css";
import { AppShellClient } from "@/components/AppShellClient";
import { SoundProvider } from "@/components/SoundProvider";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "Yank The Mask",
  description: "Swipe, match, and unmask the alien impostor."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={fredoka.className}>
        <SoundProvider>
          <AppShellClient>{children}</AppShellClient>
        </SoundProvider>
      </body>
    </html>
  );
}
