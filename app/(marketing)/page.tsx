import { Button } from "@/components/Button";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { AuthProvider } from "@/components/auth/AuthProvider";

export default function LandingPage() {
  return (
    <main className="flex min-h-full w-full flex-col items-center justify-start px-6 pb-16 pt-10 text-center">
      <div className="max-w-xl space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-400">Maskle</p>
        <h1 className="text-4xl font-semibold text-slate-700 sm:text-5xl">
          Swipe into the unknown. Is your match human or alien in disguise?
        </h1>
        <p className="text-sm text-slate-600">
          Ask the right questions, read the answers, and decide when to pull the mask. Every date
          has their own list of questions to unlock the truth.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button href="/feed" className="w-40">
            Start Swiping
          </Button>
          <Button href="/how-to-play" variant="outline" className="w-40">
            How to play
          </Button>
        </div>
      </div>
      <div className="mt-12 rounded-3xl border-2 border-white/80 bg-white/80 p-6 text-left shadow-xl">
        <p className="text-sm text-slate-600">
          &ldquo;Dating is hard. Dating someone wearing your crush&apos;s mask? Harder.&rdquo;{" "}
          <span className="text-rose-400">- The Maskle Team</span>
        </p>
      </div>
      <div className="mt-8 w-full max-w-xl">
        <AuthProvider>
          <AuthPanel />
        </AuthProvider>
      </div>
    </main>
  );
}
