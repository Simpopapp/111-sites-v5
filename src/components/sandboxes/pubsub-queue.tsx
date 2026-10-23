import { useEffect, useState } from "react";
import { createPubSubQueue } from "@/lib/simulators";

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

/** S5 — Pub/Sub + Queue Workers + Dead Letter Queue (PRD §7/S5). */
export function PubSubQueueSandbox() {
  const [flaky, setFlaky] = useState(true);
  const [queue, setQueue] = useState(() => createPubSubQueue({ flakyWorker: 1 }));
  const [view, setView] = useState({ queueDepth: 0, processed: 0, dead: 0 });
  const [log, setLog] = useState<LogLine[]>([
    { tone: "info", text: "[Ready] Publish events to feed the workers." },
  ]);

  useEffect(() => {
    const t = setInterval(() => {
      const r = queue.step();
      if (r.outcome === "idle") return;
      const time = new Date().toLocaleTimeString();
      const text =
        r.outcome === "processed"
          ? `[${time}] Worker #${r.worker} processed "${r.event?.payload}" (${r.processed} done)`
          : r.outcome === "retry"
            ? `[${time}] Worker #${r.worker} FAILED "${r.event?.payload}" (attempt ${r.event?.attempts}/3) — retrying same worker`
            : `[${time}] Worker #${r.worker} FAILED "${r.event?.payload}" 3x — sent to DEAD LETTER QUEUE`;
      setLog((prev) =>
        [
          {
            tone: (r.outcome === "processed" ? "ok" : r.outcome === "retry" ? "warn" : "err") as LogLine["tone"],
            text,
          },
          ...prev,
        ].slice(0, 30),
      );
      setView(queue.snapshot());
    }, 700);
    return () => clearInterval(t);
  }, [queue]);

  const publish = () => {
    const payload = `event-${Date.now().toString().slice(-4)}`;
    queue.publish(payload);
    setView(queue.snapshot());
    setLog((prev) =>
      [
        { tone: "info" as const, text: `[PUB] Published "${payload}" to the exchange → queue depth ${view.queueDepth + 1}` },
        ...prev,
      ].slice(0, 30),
    );
  };

  const toggleFlaky = () => {
    const next = !flaky;
    setFlaky(next);
    // Troca de config NÃO reinicia a tentativa (gate F3): o mesmo worker
    // continua com fila, contadores e log intactos.
    queue.setFlaky(next ? 1 : null);
    setLog((prev) =>
      [
        { tone: "info" as const, text: next ? "[CFG] Flaky worker ON (worker #1 fails ~75% of requests)" : "[CFG] Flaky worker OFF — all workers healthy. Counters preserved." },
        ...prev,
      ].slice(0, 30),
    );
  };

  return (
    <div>
      <div className="mb-4 grid grid-cols-3 gap-3 text-center">
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <span className="block text-xs text-muted-foreground">In Queue</span>
          <span className="font-mono text-2xl font-extrabold text-warning">{view.queueDepth}</span>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <span className="block text-xs text-muted-foreground">Processed</span>
          <span className="font-mono text-2xl font-extrabold text-success">{view.processed}</span>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <span className="block text-xs text-muted-foreground">Dead-Lettered</span>
          <span className={"font-mono text-2xl font-extrabold " + (view.dead > 0 ? "text-destructive" : "text-foreground")}>
            {view.dead}
          </span>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={publish}
          className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-transform active:scale-95"
        >
          Publish Event
        </button>
        <button
          type="button"
          onClick={toggleFlaky}
          className={
            "rounded-xl border px-4 py-2 text-xs font-semibold transition-colors " +
            (flaky
              ? "border-warning/40 bg-warning/10 text-warning"
              : "border-border bg-secondary text-foreground hover:bg-accent")
          }
        >
          {flaky ? "Flaky worker: ON" : "Flaky worker: OFF"}
        </button>
      </div>

      {view.dead > 0 ? (
        <div className="mb-3 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-center text-xs font-bold text-destructive">
          DEAD LETTER QUEUE: {view.dead} poisoned message{view.dead > 1 ? "s" : ""} awaiting human review
        </div>
      ) : null}

      <div
        role="log"
        aria-label="Event log"
        className="scrollbar-thin h-32 overflow-y-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-xs text-muted-foreground"
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
