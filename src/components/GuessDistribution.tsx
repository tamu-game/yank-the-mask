import type { GuessDistributionData } from "@/types/stats";

type GuessDistributionProps = {
  data: GuessDistributionData;
  playerOutcome: "WIN" | "LOSE" | null;
  playerGuessedAtQuestion: number | null;
};

const clampQuestion = (value: number | null, maxQuestions: number) => {
  if (!value || Number.isNaN(value)) return null;
  return Math.min(Math.max(value, 1), maxQuestions);
};

export const GuessDistribution = ({
  data,
  playerOutcome,
  playerGuessedAtQuestion
}: GuessDistributionProps) => {
  const isWin = playerOutcome === "WIN";
  const isLose = playerOutcome === "LOSE";
  const highlightQuestion = isWin
    ? clampQuestion(playerGuessedAtQuestion, data.maxQuestions)
    : null;
  const totalWins = data.totalWins;
  const mostCommon = data.distribution.reduce(
    (current, entry) =>
      entry.winCount > current.winCount ? entry : current,
    data.distribution[0] ?? { question: 0, winCount: 0, percent: 0 }
  );

  return (
    <div className="rounded-[26px] border border-white/70 bg-white/90 p-5 text-left shadow-xl">
      <div className="text-[11px] font-semibold uppercase tracking-[0.3em] text-rose-400">
        Guess distribution
      </div>
      {isWin && highlightQuestion ? (
        <div className="mt-2 text-xs text-slate-600">
          Sen: {highlightQuestion}. soruda bildin
        </div>
      ) : null}
      {isLose ? (
        <div className="mt-3 flex items-start gap-2 rounded-2xl border border-rose-200/70 bg-rose-50/70 px-3 py-2 text-xs text-rose-600">
          <span className="text-base leading-none">✕</span>
          <div>
            <div className="font-semibold">Bu tur bilemedin</div>
            <div className="text-[11px] text-rose-500/80">Bir dahaki oyunda şans!</div>
          </div>
        </div>
      ) : null}
      {totalWins === 0 ? (
        <div className="mt-3 text-xs text-slate-500">Henüz yeterli veri yok.</div>
      ) : null}
      <div className="mt-4 space-y-2">
        {data.distribution.map((entry) => {
          const isHighlight = highlightQuestion === entry.question;
          const isMostCommon = entry.question === mostCommon.question && mostCommon.winCount > 0;
          const width =
            totalWins > 0
              ? Math.max(4, entry.percent)
              : 8;
          return (
            <div key={entry.question} className="flex items-center gap-3 text-xs text-slate-600">
              <div className="w-4 text-right text-[11px] font-semibold text-slate-500">
                {entry.question}
              </div>
              <div className="relative flex-1">
                <div className="h-6 w-full rounded-full bg-amber-50/80" />
                <div
                  className={`absolute left-0 top-0 flex h-6 items-center justify-end rounded-full px-2 text-[11px] font-semibold shadow-sm transition ${
                    isHighlight
                      ? "bg-emerald-400 text-emerald-950"
                      : "bg-rose-200/80 text-rose-700"
                  } ${isMostCommon && !isHighlight ? "ring-2 ring-amber-200/70" : ""}`}
                  style={{ width: `${width}%` }}
                >
                  {totalWins > 0 ? `${entry.percent}%` : "0%"}
                </div>
              </div>
              <div className="w-10 text-right text-[11px] text-slate-500">
                {entry.winCount}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
