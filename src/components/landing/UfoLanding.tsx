"use client";

import { useState } from "react";
import Image from "next/image";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { GameButton } from "@/components/landing/GameButton";

export const UfoLanding = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  return (
    <div className="landing-outer-shell">
      <div className="landing-ufo-stage">
        <div className="landing-ufo-inner">
          <Image
            src="/backgrounds/ufo.png"
            alt="UFO spotlight scene"
            fill
            priority
            sizes="100vw"
            className="landing-ufo-image"
          />
          <div className="landing-ufo-stars" aria-hidden />
          <div className="landing-ufo-vignette" aria-hidden />
          <div className="landing-spotlight-gradient" aria-hidden />

          <div className="landing-spotlight-ui text-slate-900" style={{ paddingTop: "1rem" }}>
            <div className="space-y-1 text-center">
              <div className="mx-auto h-auto w-36">
                <Image
                  src="/logo.png"
                  alt="Yank the Mask logo"
                  width={400}
                  height={400}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>
              {/* make this text smaller */}
              <p className="text-xs uppercase tracking-[0.5em] text-[8px]">by <span className="text-[8px]">TAMU Studio</span></p>
            </div>
            <GameButton href="/feed" className="w-full mt-8" variant="primary">
              Start
            </GameButton>
            <GameButton
              href="/how-to-play"
              className="w-full text-amber-100 border-amber-200/60"
              variant="secondary"
            >
              How to Play
            </GameButton>
            <GameButton
              variant="secondary"
              className="w-full text-amber-100 border-amber-200/60"
              onClick={() => setIsAuthOpen(true)}
            >
              Log in / Register
            </GameButton>
          </div>

          {isAuthOpen && (
            <div className="landing-auth-overlay" role="dialog" aria-modal>
              <div className="landing-auth-popup">
                <div className="landing-auth-popup-header">
                  <p className="text-sm font-semibold uppercase tracking-[0.4em] text-white/60">
                    Player Access
                  </p>
                  <button className="landing-auth-close" type="button" onClick={() => setIsAuthOpen(false)}>
                    Close
                  </button>
                </div>
                <AuthProvider>
                  <AuthPanel />
                </AuthProvider>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
