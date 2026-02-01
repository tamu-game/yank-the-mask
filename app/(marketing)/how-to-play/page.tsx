import { Button } from "@/components/Button";

export default function HowToPlayPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-rose-400">How to play</p>
        <h1 className="text-3xl font-semibold text-slate-700">Spot the alien under the mask</h1>
        <p className="text-sm text-slate-500">
          Slide into the feed, start a fresh café date, and interrogate each masked character before
          you decide whether to yank their mask or trust the warmth in their eyes.
        </p>
      </div>

      <div className="space-y-4 text-sm text-slate-600">
        <ol className="space-y-3 pl-4 text-slate-600 list-decimal">
          <li>
            Swipe right on a profile in the feed to open a new date session. Swiping left skips the
            face; swiping right starts a seeded match with a ~45% chance the character is an alien
            trying to blend in.
          </li>
          <li>
            The question sheet holds every curated prompt for that character. Tap a question to ask it,
            then read the answer bubble. Every reply has a hidden suspicion score (0–3) so humans
            favor calm, low-suspicion answers while aliens occasionally slip into higher values.
          </li>
          <li>
            You can ask up to five questions before the menu closes—asked prompts lock, and the
            counter lets you know how many you have left. You must ask at least one before the choice
            bar unlocks, but you can keep probing longer if you need more evidence.
          </li>
          <li>
            Use the choice bar when you are ready. &ldquo;Yank the Mask&rdquo; accuses the character of being
            alien, &ldquo;Trust Them&rdquo; leaves the mask on. Correct calls reveal the truth with a result
            animation; wrong calls trigger the alien or angry loop sequences.
          </li>
        </ol>

        <div className="rounded-2xl border border-amber-100/70 bg-amber-50/60 p-4 text-xs uppercase tracking-[0.3em] text-amber-700">
          <p className="text-[11px] font-semibold text-amber-700/90">Scoring snapshot</p>
          <ul className="mt-2 space-y-1 text-xs text-slate-600">
            <li>Win a date → base 120 points; miss it → base 20.</li>
            <li>Every unused question adds +6 when you guess right.</li>
            <li>Expose an alien and every suspicion point nets +5, up to the meter cap (≈10 points).</li>
            <li>Wrongly accuse a human? You still get up to +16 consolation points for the effort.</li>
          </ul>
        </div>
      </div>

      <Button href="/feed" className="w-52">
        Start matching
      </Button>
    </main>
  );
}
