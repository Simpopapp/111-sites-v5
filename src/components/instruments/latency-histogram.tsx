import type { InstrumentKind } from "@/lib/lessons/types";

/** Instrumento latency-histogram (PRD project2 §15.2). */
export interface HistogramData {
  unit: string;
  bins: { from: number; to: number; count: number }[];
  /** Amostra ordenada (lista complementar). */
  sample: number[];
  markers: { label: string; value: number; convention: "nearest-rank" }[];
  scenario?: { label: string; mean: number };
  /** Limites do modelo (ex.: fragilidade de P99.9 com 100 amostras). */
  note: string;
}

/**
 * Renderizador do instrumento latency-histogram (representação + equivalente
 * textual SEMPRE visível e específico da instância — PRD project2 D13, s8).
 * Valores dos marcadores em texto, não só cor; nada depende de hover.
 */
export function LatencyHistogramInstrument({ data }: { data: HistogramData }) {
  const maxCount = Math.max(1, ...data.bins.map((b) => b.count));
  const total = data.sample.length;
  const max = data.sample.length ? data.sample[data.sample.length - 1]! : 0;
  const markerText = data.markers.map((m) => `${m.label} = ${m.value} ${data.unit}`).join("; ");
  const summary = `Histogram of ${total} request timings in ${data.unit}. ${markerText}. Maximum = ${max} ${data.unit}. Bins: ${data.bins
    .map((b) => `${b.from}–${b.to}: ${b.count}`)
    .join("; ")}.`;
  return (
    <div>
      <div
        className="mb-2 flex h-28 items-end gap-1 rounded-lg border border-border/60 bg-background/40 p-2"
        role="img"
        aria-label={summary}
      >
        {data.bins.map((b, i) => (
          <div key={i} className="flex min-w-8 flex-1 flex-col items-center">
            <span className="mb-0.5 font-mono text-xs text-muted-foreground">{b.count}</span>
            <div
              className="w-full rounded-t bg-primary/70"
              style={{ height: `${Math.max(4, (b.count / maxCount) * 80)}px` }}
            />
            <span className="mt-0.5 font-mono text-xs text-muted-foreground">
              {b.from}–{b.to}
            </span>
          </div>
        ))}
      </div>

      <p className="mb-3 rounded-lg border border-border/50 bg-background/40 px-3 py-2 text-xs leading-relaxed text-foreground/90">
        {summary}
      </p>

      <div className="mb-3 flex flex-wrap gap-2">
        {data.markers.map((m, i) => (
          <span
            key={i}
            className="rounded-full border border-accent-2/40 bg-accent-2/10 px-2.5 py-0.5 font-mono text-xs text-accent-2"
          >
            {m.label} = {m.value} {data.unit} ({m.convention})
          </span>
        ))}
        {data.scenario ? (
          <span className="rounded-full border border-border/60 bg-secondary/60 px-2.5 py-0.5 font-mono text-xs text-muted-foreground">
            {data.scenario.label}: mean = {data.scenario.mean} {data.unit}
          </span>
        ) : null}
      </div>

      <div className="mb-3 rounded-lg border border-border/60">
        <div className="border-b border-border/50 bg-secondary/60 px-2 py-1.5 font-mono text-xs uppercase tracking-wide text-muted-foreground">
          ordered sample ({total} × {data.unit})
        </div>
        <div
          role="region"
          aria-label="Ordered sample"
          tabIndex={0}
          className="scrollbar-thin max-h-40 overflow-y-auto px-2 py-1.5 font-mono text-xs leading-relaxed text-muted-foreground"
        >
          {data.sample.join(" · ")}
        </div>
      </div>

      <p className="text-xs text-muted-foreground">{data.note}</p>
    </div>
  );
}

export type LatencyHistogramInstrumentKind = Extract<InstrumentKind, "latency-histogram">;
