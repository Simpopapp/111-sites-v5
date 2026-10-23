import { useState } from "react";
import { simulateQueries } from "@/lib/simulators";

/** S3 — N+1 vs batch vs JOIN (PRD §7/S3; modelo didático honesto, spec 4.3). */
export function NPlusOneSandbox() {
  const [result, setResult] = useState<{
    naive: boolean;
    count: number;
    latencyMs: number;
    sql: string[];
    formula: string;
  } | null>(null);

  const run = (naive: boolean) => {
    const res = simulateQueries({
      users: 25,
      cardinality: 2,
      roundTripMs: 12,
      strategy: naive ? "per-item" : "join",
    });
    setResult({
      naive,
      count: res.count,
      latencyMs: res.latencyMs,
      sql: res.sql,
      formula: res.formula,
    });
  };

  return (
    <div>
      <div className="mb-5 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => run(true)}
          className="rounded-xl border border-destructive/30 bg-destructive/15 px-4 py-2 text-xs font-semibold text-destructive transition-transform hover:bg-destructive/25 active:scale-95"
        >
          Run Naive Loop (N+1)
        </button>
        <button
          type="button"
          onClick={() => run(false)}
          className="rounded-xl border border-success/30 bg-success/15 px-4 py-2 text-xs font-semibold text-success transition-transform hover:bg-success/25 active:scale-95"
        >
          Run Eager JOIN (1 Query)
        </button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 text-center">
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <span className="block text-xs text-muted-foreground">Total Database Queries</span>
          <span
            className={
              "font-mono text-2xl font-extrabold " +
              (result ? (result.naive ? "text-destructive" : "text-success") : "text-foreground")
            }
          >
            {result ? `${result.count} ${result.count === 1 ? "query" : "queries"}` : "-"}
          </span>
        </div>
        <div className="rounded-xl border border-border bg-background/60 p-3">
          <span className="block text-xs text-muted-foreground">Roundtrip Latency</span>
          <span
            className={
              "font-mono text-2xl font-extrabold " +
              (result ? (result.naive ? "text-destructive" : "text-success") : "text-foreground")
            }
          >
            {result ? `${result.latencyMs} ms` : "-"}
          </span>
        </div>
      </div>

      <div
        aria-live="polite"
        className="scrollbar-thin h-32 overflow-y-auto rounded-lg border border-border bg-background/60 p-3 font-mono text-xs text-muted-foreground"
      >
        {result
          ? result.sql.map((line, i) => (
              <div key={i} className={result.naive && i > 0 ? "text-destructive" : i === 0 || !result.naive ? "text-warning" : "text-muted-foreground"}>
                {line}
              </div>
            ))
          : "[Ready] Select an execution pattern above to view generated SQL queries."}
      </div>
    </div>
  );
}
