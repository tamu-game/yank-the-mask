import { Button } from "@/components/Button";

export default function HowToPlayPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-400">How to play</p>
        <h1 className="text-3xl font-semibold text-slate-700">Spot the alien under the mask</h1>
      </div>
      <div className="space-y-4 text-sm text-slate-600">
        <p>1) Swipe right to match with a character. Left to skip.</p>
        <p>
          2) At the cafe table, ask from that character's curated question list. Humans always
          answer perfectly. Aliens try to blend in with the occasional slip.
        </p>
        <p>3) Read the answers carefully and decide for yourself.</p>
        <p>4) After at least 1 question, choose to Yank the Mask or Trust Them.</p>
        <p>5) Fewer questions means more points if you guess correctly.</p>
      </div>
      <Button href="/feed" className="w-40">
        Go to feed
      </Button>
    </main>
  );
}
