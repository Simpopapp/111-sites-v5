import type { InstrumentKind } from "@/lib/lessons/types";

/** Instrumento request-flow (PRD project2 §15.1). */
export interface RequestFlowData {
  nodes: {
    id: string;
    label: string;
    kind: "client" | "edge" | "service" | "store";
    capacity?: number;
  }[];
  edges: { from: string; to: string; label?: string }[];
  window: { ts: number | string; accepted: number; rejected: number; destination: string }[];
  limits?: {
    kind: "token-bucket" | "window";
    capacity: number;
    refillMs?: number;
    scope?: "ip" | "route" | "global";
  }[];
}

const KIND_LABEL: Record<RequestFlowData["nodes"][number]["kind"], string> = {
  client: "client",
  edge: "edge",
  service: "service",
  store: "store",
};

/**
 * Renderizador do instrumento request-flow (representação + equivalente
 * textual SEMPRE visível e específico — PRD project2 D13, s8). Os totais
 * da janela levam prefixo textual ("ok"/"x") para não depender de cor.
 */
export function RequestFlowInstrument({ data }: { data: RequestFlowData }) {
  const nodeName = (id: string) => data.nodes.find((n) => n.id === id)?.label ?? id;
  const totalAccepted = data.window.reduce((s, w) => s + w.accepted, 0);
  const totalRejected = data.window.reduce((s, w) => s + w.rejected, 0);
  const summary = `Instrument: request-flow. ${data.window.length} window rows: ${totalAccepted} accepted ("ok") and ${totalRejected} rejected ("x"). Nodes: ${data.nodes
    .map((n) => `${n.label} (${KIND_LABEL[n.kind]})`)
    .join(", ")}. Edges: ${data.edges
    .map((e) => `${nodeName(e.from)} → ${nodeName(e.to)}${e.label ? ` — ${e.label}` : ""}`)
    .join("; ")}.${data.limits?.length ? ` Limits: ${data.limits.map((l) => `${l.kind}, capacity ${l.capacity}${l.refillMs ? `, refill ${l.refillMs}ms` : ""}${l.scope ? `, scope ${l.scope}` : ""}`).join("; ")}.` : ""}`;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {data.nodes.map((n) => (
          <div
            key={n.id}
            className="rounded-lg border border-border bg-secondary/50 px-2.5 py-1.5 text-center"
          >
            <div className="text-xs font-semibold text-foreground">{n.label}</div>
            <div className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
              {KIND_LABEL[n.kind]}
            </div>
          </div>
        ))}
      </div>
      <ul className="mb-3 space-y-1">
        {data.edges.map((e, i) => (
          <li key={i} className="font-mono text-xs text-muted-foreground">
            {nodeName(e.from)} → {nodeName(e.to)}
            {e.label ? <span className="text-foreground/80"> — {e.label}</span> : null}
          </li>
        ))}
      </ul>
      {data.limits?.map((l, i) => (
        <div
          key={i}
          className="mb-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2 font-mono text-xs text-muted-foreground"
        >
          limit: {l.kind} · capacity {l.capacity}
          {l.refillMs ? ` · refill ${l.refillMs}ms` : ""}
          {l.scope ? ` · scope ${l.scope}` : ""}
        </div>
      ))}
      <div className="overflow-hidden rounded-lg border border-border/60">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-secondary/60 text-muted-foreground">
            <tr>
              <th className="px-2 py-1.5 font-semibold">ts</th>
              <th className="px-2 py-1.5 font-semibold">accepted</th>
              <th className="px-2 py-1.5 font-semibold">rejected</th>
              <th className="px-2 py-1.5 font-semibold">destination</th>
            </tr>
          </thead>
          <tbody className="text-foreground/90">
            {data.window.map((w, i) => (
              <tr key={i} className="border-t border-border/50">
                <td className="px-2 py-1.5">{w.ts}</td>
                <td className="px-2 py-1.5 text-success">ok {w.accepted}</td>
                <td className={"px-2 py-1.5 " + (w.rejected ? "text-destructive" : "")}>
                  x {w.rejected}
                </td>
                <td className="px-2 py-1.5">{w.destination}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 rounded-lg border border-border/50 bg-background/40 px-3 py-2 text-xs leading-relaxed text-foreground/90">
        {summary}
      </p>
    </div>
  );
}

export type RequestFlowInstrumentKind = Extract<InstrumentKind, "request-flow">;
