// Renderizador de representações da aula (PRD project2 D6/D13). As lições
// carregam dados editoriais com forma própria; este componente é tolerante
// a essa forma e SEMPRE mostra o equivalente textual junto (nada escondido).

import type { Lesson } from "@/lib/lessons/types";

type Dict = Record<string, unknown>;

function asDicts(v: unknown): Dict[] {
  return Array.isArray(v) ? (v.filter((x) => typeof x === "object" && x !== null) as Dict[]) : [];
}

function kv(pairs: [string, unknown][]): string[] {
  return pairs.map(([k, v]) =>
    Array.isArray(v)
      ? `${k}: ${v.map(String).join(", ")}`
      : typeof v === "object" && v !== null
        ? `${k}: ${Object.entries(v as Dict).map(([a, b]) => `${a}=${String(b)}`).join(", ")}`
        : `${k}: ${String(v)}`,
  );
}

function KvBox({ title, entries }: { title: string; entries: [string, unknown][] }) {
  if (!entries.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-background/60 px-3 py-2 font-mono text-xs text-muted-foreground">
      <span className="font-semibold text-foreground/80">{title}</span>
      {kv(entries).map((line, i) => (
        <div key={i}>{line}</div>
      ))}
    </div>
  );
}

export function LessonRepresentation({ lesson }: { lesson: Lesson }) {
  const { kind, data } = lesson.representation;
  const d = data as Dict;

  if (kind === "request-flow") {
    const nodes = asDicts(d["nodes"]);
    const edges = asDicts(d["edges"]);
    const window = (d["window"] ?? {}) as Dict;
    const limits = (d["limits"] ?? {}) as Dict;
    return (
      <div>
        <div className="mb-3 flex flex-wrap items-center gap-2">
          {nodes.map((n, i) => (
            <div key={i} className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-xs font-semibold text-foreground">
              {String(n["label"] ?? n["id"] ?? "")}
            </div>
          ))}
        </div>
        <ul className="mb-3 space-y-1">
          {edges.map((e, i) => (
            <li key={i} className="font-mono text-xs text-muted-foreground">
              {String(e["from"] ?? "")} → {String(e["to"] ?? "")}
              {e["label"] ? <span className="text-foreground/80"> — {String(e["label"])}</span> : null}
            </li>
          ))}
        </ul>
        {typeof window["label"] === "string" ? (
          <p className="mb-3 text-xs text-muted-foreground">Window: {window["label"]}</p>
        ) : null}
        <KvBox title="Limits · " entries={Object.entries(limits)} />
      </div>
    );
  }

  if (kind === "state-machine") {
    const states = asDicts(d["states"]);
    const transitions = asDicts(d["transitions"]);
    const now = typeof d["now"] === "string" ? d["now"] : undefined;
    const history = Array.isArray(d["history"]) ? d["history"].map(String) : [];
    const budget = (d["budget"] ?? {}) as Dict;
    return (
      <div>
        <div className="mb-3 flex flex-wrap gap-2">
          {states.map((s, i) => {
            const isNow = now === String(s["id"]);
            return (
              <div
                key={i}
                className={
                  "rounded-lg border px-2.5 py-1.5 text-xs font-semibold " +
                  (isNow
                    ? "border-primary/60 bg-primary/15 text-foreground"
                    : "border-border bg-secondary/50 text-muted-foreground")
                }
              >
                {String(s["label"] ?? s["id"] ?? "")}
                {isNow ? <span className="ml-1 font-mono text-xs text-primary">← now</span> : null}
              </div>
            );
          })}
        </div>
        <ul className="mb-3 space-y-1">
          {transitions.map((t, i) => (
            <li key={i} className="font-mono text-xs text-muted-foreground">
              {String(t["from"] ?? "")} → {String(t["to"] ?? "")}
              {t["label"] ? <span className="text-foreground/80"> — {String(t["label"])}</span> : null}
            </li>
          ))}
        </ul>
        {history.length ? (
          <p className="mb-3 text-xs text-muted-foreground">History: {history.join(" → ")}</p>
        ) : null}
        <KvBox title="Policy budget · " entries={Object.entries(budget)} />
      </div>
    );
  }

  if (kind === "latency-histogram") {
    const bins = asDicts(d["bins"]);
    const markers = asDicts(d["markers"]);
    const maxCount = Math.max(1, ...bins.map((b) => Number(b["count"] ?? 0)));
    return (
      <div>
        <p className="mb-3 text-xs text-muted-foreground">
          {typeof d["scenario"] === "string" ? d["scenario"] : null}
        </p>
        <div className="mb-3 space-y-2">
          {bins.map((b, i) => (
            <div key={i}>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  {typeof b["label"] === "string" ? b["label"] : `${b["min"]}–${b["max"]}`}
                </span>
                <span className="font-mono">{String(b["count"] ?? "")}</span>
              </div>
              <div className="h-2 rounded bg-muted">
                <div
                  className="h-2 rounded bg-primary"
                  style={{ width: `${(Number(b["count"] ?? 0) / maxCount) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        <ul className="mb-3 space-y-1 text-xs text-muted-foreground">
          {markers.map((m, i) => (
            <li key={i} className="font-mono">
              {String(m["label"] ?? "")}: {String(m["value"] ?? "")}
            </li>
          ))}
        </ul>
        {typeof d["note"] === "string" ? (
          <p className="text-xs text-muted-foreground">{d["note"]}</p>
        ) : null}
      </div>
    );
  }

  if (kind === "query-explainer") {
    const rows = asDicts(d["rows"]);
    const keys = rows.length ? Object.keys(rows[0] as Dict) : [];
    return (
      <div>
        {rows.length ? (
          <div className="overflow-hidden rounded-lg border border-border/60">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-secondary/60 text-muted-foreground">
                <tr>
                  {keys.map((k) => (
                    <th key={k} className="px-2 py-1.5 font-semibold">
                      {k}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-foreground/90">
                {rows.map((r, i) => (
                  <tr key={i} className="border-t border-border/50">
                    {keys.map((k) => (
                      <td key={k} className="px-2 py-1.5">
                        {String(r[k] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}
        {Array.isArray(d["queries"]) ? (
          <ul className="mt-3 space-y-1">
            {(d["queries"] as unknown[]).map((q, i) => (
              <li key={i} className="font-mono text-xs text-muted-foreground">
                {String(q)}
              </li>
            ))}
          </ul>
        ) : null}
        {typeof d["assumptions"] === "string" ? (
          <p className="mt-3 text-xs text-muted-foreground">Assumptions: {d["assumptions"]}</p>
        ) : null}
      </div>
    );
  }

  if (kind === "timeline") {
    const events = asDicts(d["events"]);
    return (
      <div>
        <div className="space-y-2">
          {events.map((e, i) => (
            <KvBox key={i} title={`${i + 1}. ${String(e["label"] ?? "")} · `} entries={Object.entries(e).filter(([k]) => k !== "label")} />
          ))}
        </div>
        {typeof d["deadline"] === "number" ? (
          <p className="mt-3 text-xs text-muted-foreground">Deadline: {d["deadline"]}</p>
        ) : null}
        {typeof d["formula"] === "string" ? (
          <p className="font-mono text-xs text-muted-foreground">{d["formula"]}</p>
        ) : null}
        {typeof d["jitter"] === "string" ? (
          <p className="text-xs text-muted-foreground">Jitter: {d["jitter"]}</p>
        ) : null}
        {typeof d["note"] === "string" ? (
          <p className="mt-1 text-xs text-muted-foreground">{d["note"]}</p>
        ) : null}
      </div>
    );
  }

  // event-track / table: sem renderizador nesta rodada — o equivalente
  // textual abaixo é a rendição completa e honesta (D2).
  return null;
}
