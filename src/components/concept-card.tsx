import { ArrowRight, Layers } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Concept } from "@/lib/concepts";
import { hasLesson } from "@/lib/lessons";

interface ConceptCardProps {
  concept: Concept;
}

/**
 * Card do conceito (planejamento §9.2): problema/objetivo em 1ª linha, nível
 * e tipo de experiência. A marcação "implementado" não disputa o clique —
 * o registro de aplicação vive em "Meu app". O card inteiro navega.
 */
export function ConceptCard({ concept }: ConceptCardProps) {
  const deep = hasLesson(concept.id);
  return (
    <div className="group relative flex flex-col justify-between rounded-xl border border-border/70 bg-card/50 p-4 transition-colors duration-200 hover:border-primary/40 hover:bg-card">
      {/* Overlay clicável — acima do conteúdo */}
      <Link
        to="/concepts/$id"
        params={{ id: String(concept.id) }}
        className="absolute inset-0 z-10 rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring"
        aria-label={`Open concept #${concept.id}: ${concept.name}`}
      />

      <div className="relative">
        <div className="mb-2.5 flex items-start justify-between gap-2">
          <span className="rounded border border-border bg-muted px-2 py-0.5 font-mono text-xs font-bold text-primary">
            #{concept.id}
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {concept.cat}
          </span>
        </div>

        <h3 className="text-base font-bold text-foreground transition-colors group-hover:text-primary">
          {concept.name}
        </h3>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
          {concept.eli}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs">
        <span
          className={
            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-semibold " +
            (deep
              ? "bg-primary/10 text-primary"
              : "bg-muted text-muted-foreground")
          }
        >
          <Layers className="size-3" />
          {deep ? "Deep lesson" : "Quick reference"}
        </span>
        <span className="flex items-center gap-1 font-mono text-muted-foreground transition-colors group-hover:text-foreground">
          Study or practice
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </div>
  );
}
