import type { InstrumentKind } from "@/lib/lessons/types";

/** Instrumento state-machine (PRD project2 §15.3). */
export interface StateMachineData {
  states: { id: string; label: string; tone: "ok" | "warn" | "down" }[];
  transitions: { from: string; to: string; trigger: string }[];
  now: string;
  history: { ts: number; event: string; from: string; to?: string }[];
  budget?: { label: string; ms: number };
}

/** Cor + forma + texto: o tom nunca depende só de cor (PRD project2 D13, s8). */
const TONE_CLASS: Record<StateMachineData["states"][number]["tone"], string> = {
  ok: "border-success/40 bg-success/10 text-success",
  warn: "border-warning/40 bg-warning/10 text-warning",
  down: "border-destructive/40 bg-destructive/10 text-destructive",
};

const TONE_MARK: Record<StateMachineData["states"][number]["tone"], string> = {
  ok: "●",
  warn: "▲",
  down: "■",
};

const stateLabel = (data: StateMachineData, id: string) =>
  data.states.find((s) => s.id === id)?.label ?? id;

/** Renderizador do instrumento state-machine (representação + equivalente textual visível). */
export function StateMachineInstrument({ data }: { data: StateMachineData }) {
  const nowState = data.states.find((s) => s.id === data.now);
  const summary = `Instrument: state-machine. Current state: ${stateLabel(data, data.now)}${
    nowState ? ` (${nowState.tone})` : ""
  }. States: ${data.states.map((s) => `${s.label} (${s.tone})`).join("; ")}. Transitions: ${data.transitions
    .map((t) => `${stateLabel(data, t.from)} → ${stateLabel(data, t.to)} — trigger: ${t.trigger}`)
    .join("; ")}.${data.budget ? ` Budget: ${data.budget.label}, ${data.budget.ms} ms.` : ""}`;
  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        {data.states.map((s) => (
          <div
            key={s.id}
            className={
              "rounded-lg border px-2.5 py-1.5 text-xs font-semibold " +
              TONE_CLASS[s.tone] +
              (s.id === data.now ? " ring-2 ring-ring" : "")
            }
          >
            <span aria-hidden="true" className="mr-1">
              {TONE_MARK[s.tone]}
            </span>
            {s.label}
            {s.id === data.now ? <span className="ml-1 font-mono text-xs">← now</span> : null}
          </div>
        ))}
      </div>

      <ul className="mb-3 space-y-1">
        {data.transitions.map((t, i) => (
          <li key={i} className="font-mono text-xs text-muted-foreground">
            {stateLabel(data, t.from)} → {stateLabel(data, t.to)}
            <span className="text-foreground/80"> — trigger: {t.trigger}</span>
          </li>
        ))}
      </ul>

      {data.budget ? (
        <div className="mb-3 rounded-lg border border-border/60 bg-background/60 px-3 py-2 font-mono text-xs text-muted-foreground">
          budget: {data.budget.label} · {data.budget.ms} ms
        </div>
      ) : null}

      <div className="rounded-lg border border-border/60">
        <div className="border-b border-border/50 bg-secondary/60 px-2 py-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          history
        </div>
        <ol className="space-y-1 px-2 py-2 font-mono text-xs text-foreground/90">
          {data.history.map((h, i) => (
            <li key={i}>
              t{h.ts}: {h.event}
              {h.to ? <span className="text-muted-foreground"> → {stateLabel(data, h.to)}</span> : null}
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-3 rounded-lg border border-border/50 bg-background/40 px-3 py-2 text-xs leading-relaxed text-foreground/90">
        {summary}
      </p>
    </div>
  );
}

export type StateMachineInstrumentKind = Extract<InstrumentKind, "state-machine">;
