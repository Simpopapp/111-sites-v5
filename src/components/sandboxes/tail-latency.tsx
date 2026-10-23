import { useState } from "react";
import { percentile, simulateLatencies } from "@/lib/simulators";

interface Result {
  p50: number;
  p99: number;
  p999: number;
  max: number;
  buckets: { from: number; to: number; count: number }[];
}

function bucketize(sorted: number[], buckets = 14): Result["buckets"] {
  if (sorted.length === 0) return [];
  const min = sorted[0] ?? 0;
  const max = sorted[sorted.length - 1] ?? 0;
  const span = Math.max(1, Math.ceil((max - min) / buckets));
  const out = Array.from({ length: buckets }, (_, i) => ({
    from: min + i * span,
    to: min + (i + 1) * span,
    count: 0,
  }));
  for (const ms of sorted) {
    const idx = Math.min(buckets - 1, Math.floor((ms - min) / span));
    const target = out[idx];
    if (target) target.count++;
  }
  return out;
}

/** S6 — P99 & Tail Latency (PRD §7/S6). */
export function TailLatencySandbox() {
  const [seed, setSeed] = useState(1);
  const [result, setResult] = useState<Result | null>(null);

  const send = () => {
    const nextSeed = seed + 1;
    setSeed(nextSeed);
    const sorted = [...simulateLatencies(100, nextSeed * 7919)].sort((a, b) => a - b);
    setResult({
      p50: percentile(sorted, 50),
      p99: percentile(sorted, 99),
      p999: percentile(sorted, 99.9),
      max: sorted[sorted.length - 1] ?? 0,
      buckets: bucketize(sorted),
    });
  };

  const maxCount = result ? Math.max(...result.buckets.map((b) => b.count)) : 1;

  return (
    <div>
      <div className="mb-4 flex justify-center gap-2">
        <button
          type="button"
          onClick={send}
          className="rounded-xl bg-info px-5 py-2.5 text-xs font-bold text-info-foreground transition-transform active:scale-95"
        >
          Send 100 requests
        </button>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="rounded-xl border border-border bg-secondary px-3 py-2.5 text-xs text-foreground transition-colors hover:bg-accent"
        >
          Clear
        </button>
      </div>

      {result ? (
        <>
          <div className="mb-4 grid grid-cols-4 gap-2 text-center">
            {(
              [
                ["p50", result.p50, "text-info"],
                ["p99", result.p99, "text-warning"],
                ["p99.9", result.p999, "text-destructive"],
                ["max", result.max, "text-destructive"],
              ] as const
            ).map(([label, value, cls]) => (
              <div key={label} className="rounded-xl border border-border bg-background/60 p-2">
                <span className="block font-mono text-xs uppercase text-muted-foreground">{label}</span>
                <span className={"font-mono text-lg font-extrabold " + cls}>{value}ms</span>
              </div>
            ))}
          </div>

          <div className="mb-3 flex h-32 items-end gap-1 rounded-xl border border-border bg-background/60 p-3">
            {result.buckets.map((b, i) => (
              <div
                key={i}
                className="flex flex-1 flex-col items-center gap-1"
                title={`${b.from}–${b.to}ms: ${b.count} requests`}
                aria-label={`${b.from} to ${b.to} milliseconds: ${b.count} requests`}
              >
                <span className="font-mono text-xs text-muted-foreground" aria-hidden="true">
                  {b.count > 0 ? b.count : ""}
                </span>
                <div
                  className={
                    "w-full rounded-t " +
                    (b.to >= 7000 ? "bg-destructive" : b.from >= 1800 ? "bg-warning" : "bg-info")
                  }
                  style={{ height: `${Math.max(2, (b.count / maxCount) * 100)}%` }}
                />
              </div>
            ))}
          </div>

          <p className="text-center text-xs leading-relaxed text-muted-foreground">
            99 throws arrive in ~1s, but one took {result.max}ms — the dog caught the ball.
            Your <span className="text-warning">p99</span> users feel the tail, not the average.
          </p>
        </>
      ) : (
        <p className="text-center text-xs text-muted-foreground">
          [Ready] Fire 100 simulated requests to draw the latency distribution.
        </p>
      )}
    </div>
  );
}
