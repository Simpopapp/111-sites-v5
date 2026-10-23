import { useEffect, useState } from "react";
import { createCircuitBreaker, type BreakerState } from "@/lib/simulators";

interface LogLine {
  tone: "ok" | "err" | "warn" | "info";
  text: string;
}

const TONE_CLASS: Record<LogLine["tone"], string> = {
  ok: "text-success",
  err: "text-destructive",
  warn: "text-warning",
  info: "text-info",
};

/** S2 — Circuit Breaker: máquina de estados CLOSED → OPEN → HALF-OPEN (PRD §7/S2). */
export function CircuitBreakerSandbox() {
  const [breaker, setBreaker] = useState(() =>
    createCircuitBreaker({ threshold: 3, cooldownMs: 5000 }),
  );
  const [state, setState] = useState<BreakerState>("closed");
  const [failures, setFailures] = useState(0);
  const [log, setLog] = useState<LogLine[]>([
    { tone: "info", text: "[Ready] Circuit breaker listening." },
  ]);

  // Polling para refletir a transição automática OPEN → HALF-OPEN após o cooldown
  useEffect(() => {
    const t = setInterval(() => setState(breaker.state()), 500);
    return () => clearInterval(t);
  }, [breaker]);

  const push = (line: LogLine) => setLog((prev) => [line, ...prev].slice(0, 30));

  const send = (ok: boolean) => {
    const time = new Date().toLocaleTimeString();
    const res = breaker.record(ok);
    setState(res.state);
    if (res.blocked) {
      push({ tone: "warn", text: `[${time}] FAST FAIL: Circuit is OPEN. Request blocked in 0.1ms without calling the broken service.` });
      return;
    }
    if (ok) {
      push({ tone: "ok", text: `[${time}] 200 OK: Downstream service responded successfully.` });
    } else {
      const n = failures + 1;
      push({ tone: "err", text: `[${time}] 500 ERROR: Remote service timeout/failure (${n}/3).` });
      if (state === "closed") {
        setFailures(n);
        if (n >= 3) {
          setFailures(0);
          push({ tone: "warn", text: `[${time}] TRIP: 3 failures reached! Circuit is now OPEN.` });
        }
      } else {
        setFailures(0);
        push({ tone: "warn", text: `[${time}] Probe failed. Circuit re-opens for another cooldown.` });
      }
    }
  };

  const reset = () => {
    breaker.reset();
    setBreaker(createCircuitBreaker({ threshold: 3, cooldownMs: 5000 }));
    setState("closed");
    setFailures(0);
    setLog([{ tone: "info", text: "[Reset] Circuit breaker reset to CLOSED." }]);
  };

  const badgeClass =
    state === "closed"
      ? "border-success/30 bg-success/10 text-success"
      : state === "open"
        ? "motion-safe:animate-pulse border-destructive/30 bg-destructive/10 text-destructive"
        : "border-warning/30 bg-warning/10 text-warning";
  const badgeText =
    state === "closed"
      ? `STATE: CLOSED (Normal - Failures: ${failures}/3)`
      : state === "open"
        ? "STATE: OPEN (Failing Fast - Downstream Protected)"
        : "STATE: HALF-OPEN (Probing with one request)";

  return (
    <div>
      <div className={`mb-4 inline-block rounded-full border px-4 py-1.5 font-mono text-xs font-bold ${badgeClass}`}>
        {badgeText}
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={() => send(true)}
          className="rounded-xl bg-success px-4 py-2 text-xs font-semibold text-success-foreground transition-transform active:scale-95"
        >
          Simulate Success (200)
        </button>
        <button
          type="button"
          onClick={() => send(false)}
          className="rounded-xl bg-destructive px-4 py-2 text-xs font-semibold text-destructive-foreground transition-transform active:scale-95"
        >
          Simulate Downstream Error (500)
        </button>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl border border-border bg-secondary px-3 py-2 text-xs text-foreground transition-colors hover:bg-accent"
        >
          Reset
        </button>
      </div>
      <div
        role="log"
        aria-label="Circuit breaker log"
        className="scrollbar-thin mt-4 h-28 overflow-y-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-xs text-muted-foreground"
      >
        {log.map((line, i) => (
          <div key={i} className={TONE_CLASS[line.tone]}>
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
