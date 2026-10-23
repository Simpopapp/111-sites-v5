import { useState } from "react";
import { evaluateSqlInjection } from "@/lib/simulators";

/** S4 — SQL Injection Tester (PRD §7/S4; semântica coerente spec 4.1). */
export function SqlInjectionSandbox() {
  const [input, setInput] = useState("' OR '1'='1");
  const [result, setResult] = useState<ReturnType<typeof evaluateSqlInjection> | null>(null);

  return (
    <div>
      <label htmlFor="sqli-input" className="mb-1 block text-xs font-semibold text-foreground">
        Simulated User Input (Username):
      </label>
      <div className="mb-4 flex flex-wrap gap-2">
        <input
          id="sqli-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border border-border bg-background/60 px-3 py-1.5 font-mono text-xs text-warning focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          onClick={() => setResult(evaluateSqlInjection(input, "concat"))}
          className="rounded-xl border border-destructive/30 bg-destructive/15 px-3 py-1.5 text-xs font-semibold text-destructive transition-transform hover:bg-destructive/25 active:scale-95"
        >
          Unescaped Query
        </button>
        <button
          type="button"
          onClick={() => setResult(evaluateSqlInjection(input, "parameterized"))}
          className="rounded-xl border border-success/30 bg-success/15 px-3 py-1.5 text-xs font-semibold text-success transition-transform hover:bg-success/25 active:scale-95"
        >
          Parameterized Query
        </button>
      </div>

      <div
        aria-live="polite"
        className="rounded-xl border border-border bg-background/60 p-4 font-mono text-xs leading-relaxed text-foreground/90"
      >
        {result ? (
          <div>
            <div
              className={
                "mb-1 font-bold " +
                (result.supported ? (result.mode === "parameterized" ? "text-success" : "text-destructive") : "text-warning")
              }
            >
              {result.supported
                ? result.mode === "parameterized"
                  ? "SECURE CODE: Prepared Statement / Parameterized"
                  : "VULNERABLE CODE: String Concat / Template Literals"
                : "OUTSIDE THE MODEL — reason with the mechanism"}
            </div>
            <div className="mb-2 rounded bg-muted/50 p-2 text-muted-foreground">{result.sql}</div>
            <div className="mb-2">
              <span className="text-muted-foreground">Rows returned: </span>
              <span className={result.rows.length ? "text-warning" : "text-foreground"}>
                {result.rows.length ? result.rows.join(", ") : "0"}
              </span>
            </div>
            {result.precedence ? (
              <p className="mt-2 text-xs text-info/90">{result.precedence}</p>
            ) : null}
            <p
              className={
                "mt-2 text-xs " +
                (result.supported ? (result.mode === "parameterized" ? "text-success/90" : "text-destructive/90") : "text-muted-foreground")
              }
            >
              {result.verdict}
            </p>
          </div>
        ) : (
          "[Awaiting Execution] Click one of the execution modes above to inspect generated SQL logic."
        )}
      </div>
    </div>
  );
}
