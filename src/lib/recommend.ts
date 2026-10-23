// Personalização leve e explicável (PRD project2 D9/D11). Função pura:
// recomendações com motivo OBRIGATÓRIO, ordenadas por prioridade contratada:
// 1) revisão pendente → 2) lacuna de pré-requisito de missão ativa →
// 3) próxima etapa do percurso → 4) desafio sem tentativa. Máximo 3 itens.

import type { LearningState } from "@/lib/learning";
import { CONCEPTS } from "@/lib/concepts";
import { TASKS, getTask } from "@/lib/exercises-data";

/** Dica de missão ativa, fornecida pela camada de missões (D10). */
export interface MissionHint {
  slug: string;
  title: string;
  stepTitle: string;
  /** Conceitos pré-requisito ainda sem demonstração para seguir a missão. */
  pendingConceptIds: number[];
}

export type RecommendationKind =
  | "review"
  | "mission-gap"
  | "route-step"
  | "challenge";

export interface Recommendation {
  kind: RecommendationKind;
  /** O que fazer — ação concreta, curta. */
  label: string;
  /** Motivo curto e específico (obrigatório — planejamento §13). */
  reason: string;
  href: string;
  conceptId?: number;
  taskId?: string;
}

/** Percursos exemplares do planejamento §8.3, limitados ao que já tem aulas. */
const ROUTES: { id: string; title: string; keywords: string[]; conceptIds: number[] }[] = [
  {
    id: "request-lost",
    title: "The request didn't finish",
    keywords: ["lost", "timeout", "retry", "idempotency", "uncertain", "cobran", "perdida"],
    conceptIds: [11, 12, 13, 14, 10],
  },
  {
    id: "page-slow",
    title: "The page got slow",
    keywords: ["slow", "lento", "latency", "n+1", "cache", "performance"],
    conceptIds: [27, 25, 26, 2, 91, 93],
  },
  {
    id: "work-accumulating",
    title: "Work is accumulating",
    keywords: ["queue", "fila", "backlog", "accumul", "dlq", "worker"],
    conceptIds: [15, 16, 17, 20],
  },
];

const conceptName = new Map(CONCEPTS.map((c) => [c.id, c.name]));

function routeFor(objective?: string) {
  const needle = (objective ?? "").toLowerCase();
  return (
    ROUTES.find((r) => r.keywords.some((k) => needle.includes(k))) ?? ROUTES[0]!
  );
}

/**
 * Recomendações ordenadas por prioridade (D9). Cada item traz motivo curto;
 * a UI pode exibi-lo e o aluno pode ignorá-lo (planejamento §13).
 */
export function recommendNext(
  state: LearningState,
  objective?: string,
  opts?: { now?: number; missionHints?: MissionHint[]; limit?: number },
): Recommendation[] {
  const now = opts?.now ?? Date.now();
  const limit = opts?.limit ?? 3;
  const out: Recommendation[] = [];

  // 1) Revisão pendente (retenção — planejamento §14.4). Sem fila punitiva.
  const due = state.reviews
    .filter((rv) => rv.doneTs === undefined && rv.dueTs <= now)
    .sort((a, b) => a.dueTs - b.dueTs);
  for (const rv of due) {
    if (out.length >= limit) break;
    const task = getTask(rv.taskId);
    if (!task) continue;
    out.push({
      kind: "review",
      taskId: task.id,
      conceptId: task.conceptId,
      label: `Retake the transfer variant for ${conceptName.get(task.conceptId) ?? `#${task.conceptId}`}`,
      reason:
        "Scheduled recovery: retelling the reasoning after the interval is the evidence for retention — not rereading the text.",
      href: `/concepts/${task.conceptId}`,
    });
  }

  // 2) Lacuna de pré-requisito de missão ativa (D10).
  for (const hint of opts?.missionHints ?? []) {
    if (out.length >= limit) break;
    const gap = hint.pendingConceptIds.find(
      (id) => !state.attempts.some((a) => a.conceptId === id && a.outcome === "met"),
    );
    if (gap === undefined) continue;
    out.push({
      kind: "mission-gap",
      conceptId: gap,
      label: `Cover ${conceptName.get(gap) ?? `#${gap}`} before continuing ${hint.title}`,
      reason: `The mission step "${hint.stepTitle}" assumes this mechanism — a gap here makes the next decision guesswork.`,
      href: `/concepts/${gap}`,
    });
  }

  // 3) Próxima etapa do percurso (objetivo influencia qual percurso).
  const route = routeFor(objective);
  const routeGap = route.conceptIds.find((id) => {
    const attempts = state.attempts.filter((a) => a.conceptId === id);
    return !attempts.some(
      (a) => a.help <= 1 && Object.keys(a.criteria).length > 0 && Object.values(a.criteria).every(Boolean),
    );
  });
  if (routeGap !== undefined && out.length < limit) {
    out.push({
      kind: "route-step",
      conceptId: routeGap,
      label: `Continue the route "${route.title}" at ${conceptName.get(routeGap) ?? `#${routeGap}`}`,
      reason: `Next step of the route: each concept builds on the previous one — ${route.title.toLowerCase()} reads in order.`,
      href: `/concepts/${routeGap}`,
    });
  }

  // 4) Desafio sem tentativa (prática ainda não tocada).
  if (out.length < limit) {
    const untouched = TASKS.find(
      (t) => !state.attempts.some((a) => a.conceptId === t.conceptId),
    );
    if (untouched) {
      out.push({
        kind: "challenge",
        taskId: untouched.id,
        conceptId: untouched.conceptId,
        label: `Try a first challenge on ${conceptName.get(untouched.conceptId) ?? `#${untouched.conceptId}`}`,
        reason: "You haven't attempted any task on this concept yet — prediction before explanation is where honest progress starts.",
        href: `/concepts/${untouched.conceptId}`,
      });
    }
  }

  return out.slice(0, limit);
}
