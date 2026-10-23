import { useState } from "react";
import { Zap } from "lucide-react";
import { createTokenBucket, type TokenBucket } from "@/lib/simulators";

const CAPACITY = 5;
const REFILL_MS = 1500;

interface LogLine {
  ok: boolean;
  text: string;
}

/** S1 — Rate Limiting: token bucket ao vivo (PRD §7/S1). */
export function RateLimiterSandbox() {
  const [bucket, setBucket] = useState<TokenBucket>(() =>
    createTokenBucket({ capacity: CAPACITY, refillIntervalMs: REFILL_MS }),
  );
  const [tokens, setTokens] = useState(CAPACITY);
  const [log, setLog] = useState<LogLine[]>([
    { ok: true, text: "[Ready] Click above to dispatch network requests." },
  ]);

  const fire = () => {
    bucket.tick();
    const time = new Date().toLocaleTimeString();
    const res = bucket.tryConsume();
    setTokens(res.remaining);
    setLog((prev) =>
      [
        {
          ok: res.ok,
          text: res.ok
            ? `[${time}] 200 OK - Request passed. Remaining tokens: ${res.remaining}`
            : `[${time}] 429 TOO MANY REQUESTS - Rate limit exceeded. Throttled.`,
        },
        ...prev,
      ].slice(0, 30),
    );
  };

  const reset = () => {
    setBucket(createTokenBucket({ capacity: CAPACITY, refillIntervalMs: REFILL_MS }));
    setTokens(CAPACITY);
    setLog([{ ok: true, text: "[Reset] Bucket restored to full capacity." }]);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-center gap-2">
        {Array.from({ length: CAPACITY }).map((_, i) => (
          <div
            key={i}
            className={
              "flex size-8 items-center justify-center rounded-lg border font-mono text-xs font-bold transition-all " +
              (i < tokens
                ? "border-warning bg-warning text-warning-foreground"
                : "border-border bg-muted text-muted-foreground/50")
            }
          >
            <Zap className="size-4" />
          </div>
        ))}
      </div>
      <p className="mb-4 text-center font-mono text-xs text-muted-foreground">
        Bucket capacity: {CAPACITY} tokens · refill 1 / 1.5s (refills on request)
      </p>
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={fire}
          className="rounded-xl bg-primary px-5 py-2.5 text-xs font-bold text-primary-foreground shadow-lg transition-transform active:scale-95"
        >
          Send HTTP GET /api/v1/data
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-border bg-secondary px-3 py-2.5 text-xs text-foreground transition-colors hover:bg-accent"
        >
          Reset
        </button>
      </div>
      <div
        role="log"
        aria-label="Request log"
        className="scrollbar-thin mt-4 h-28 overflow-y-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-xs text-muted-foreground"
      >
        {log.map((line, i) => (
          <div key={i} className={line.ok ? "text-success" : "font-bold text-destructive"}>
            {line.text}
          </div>
        ))}
      </div>
      {/* Um único anúncio discreto: o último evento relevante — nunca cada linha. */}
      <div role="status" className="sr-only">
        {log.at(-1)?.text ?? ""}
      </div>
    </div>
  );
}
