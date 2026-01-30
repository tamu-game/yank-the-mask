import { Button } from "@/components/Button";

export default function LandingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-16 text-center">
      <div className="max-w-xl space-y-6">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-400">Maskle</p>
        <h1 className="text-4xl font-semibold text-slate-700 sm:text-5xl">
          Swipe into the unknown. Is your match human or alien in disguise?
        </h1>
        <p className="text-sm text-slate-600">
          Ask the right questions, read the vibe, and decide when to pull the mask. You have
          ten questions to find the truth.
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
          "Dating is hard. Dating someone wearing your crush's mask? Harder." 
          <span className="text-rose-400">- The Maskle Team</span>
        </p>
      </div>
    </main>
  );
}
