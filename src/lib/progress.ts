// Progresso honesto (PRD project2 D9 / planejamento §14.1). Lógica pura:
// nenhuma porcentagem global, nenhum "Mission ready", denominadores rotulados.
// Cada dimensão tem semântica exata e testada — nunca reinterpretar
// autodeclaração como domínio (planejamento §14.3).

import type { LearningState } from "@/lib/learning";
import { RETENTION_INTERVAL_MS } from "@/lib/learning";
import { TASKS, getTask } from "@/lib/exercises-data";

// Reexportado para os consumidores da semântica D9 (fonte: learning.ts).
export { RETENTION_INTERVAL_MS };

export type Dimension =
  | "contact"
  | "practiced"
  | "demonstrated"
  | "transferred"
  | "retained"
  | "applied";

export const DIMENSIONS: Dimension[] = [
  "contact",
  "practiced",
  "demonstrated",
  "transferred",
  "retained",
  "applied",
];

/** Rótulo da UI (glossário do PRD §13). */
export const DIMENSION_LABELS: Record<Dimension, string> = {
  contact: "Contact",
  practiced: "Practiced",
  demonstrated: "Demonstrated",
  transferred: "Transferred",
  retained: "Retained",
  applied: "Declared applied",
};

/** O que a dimensão significa — e o que ela NÃO significa (planejamento §14.1). */
export const DIMENSION_MEANING: Record<Dimension, string> = {
  contact: "You opened this lesson. Says nothing about understanding.",
  practiced: "You attempted at least one task, with whatever help you used.",
  demonstrated: "You met every criterion of a task without decisive help.",
  transferred: "You solved a variant task — different names, same principle.",
  retained: "You recovered a variant after the scheduled interval.",
  applied: "You registered use in your own app. Self-declaration, never proof.",
};

/** Contagem por dimensão com denominador rotulado (PRD D9). */
export interface DimensionStat {
  count: number;
  denominator: number;
  /** Denominador explícito e honesto, ex.: "3 of 111 concepts have deep lessons". */
  denominatorLabel: string;
}

export function conceptDimensions(
  state: LearningState,
  conceptId: number,
): Record<Dimension, boolean> {
  const attempts = state.attempts.filter((a) => a.conceptId === conceptId);

  // Contato: entrada em learning.contact (PRD D9).
  const contact = state.contact[conceptId] !== undefined;

  // Prática: tentativa com outcome ≠ missed (tentativa é atividade, não domínio).
  const practiced = attempts.some((a) => a.outcome !== "missed");

  // Demonstrado no contexto: help ≤ 1 E todos os critérios true. Ajudo 2–3
  // (pista forte/solução revelada) não qualifica (PRD D8/D9).
  const demonstrated = attempts.some(
    (a) =>
      a.help <= 1 &&
      Object.keys(a.criteria).length > 0 &&
      Object.values(a.criteria).every(Boolean),
  );

  // Transferido: tentativa de tarefa do tipo `variant` com outcome met.
  const transferred = attempts.some(
    (a) => getTask(a.taskId)?.type === "variant" && a.outcome === "met",
  );

  // Retido: recuperação de variante reagendada. Exige review com dueTs ≥
  // tentativa original + 72h e uma tentativa posterior (≥ dueTs) com met.
  const retained = state.reviews.some((rv) => {
    const original = attempts.find((a) => a.taskId === rv.taskId);
    if (!original) return false;
    if (rv.dueTs < original.ts + RETENTION_INTERVAL_MS) return false;
    return attempts.some(
      (a) => a.taskId === rv.taskId && a.ts >= rv.dueTs && a.outcome === "met",
    );
  });

  // Aplicação declarada: entrada em application (autodeclaração legada 1:1).
  const applied = state.application[conceptId] !== undefined;

  return { contact, practiced, demonstrated, transferred, retained, applied };
}

/** Conceitos que têm ao menos uma tarefa de prática no motor (D8). */
function conceptsWithTasks(): Set<number> {
  return new Set(TASKS.map((t) => t.conceptId));
}

/** Conceitos com tarefa `variant` (denominador honesto de Transferido/Retido). */
function conceptsWithVariant(): Set<number> {
  const ids = new Set<number>();
  for (const t of TASKS) {
    if (t.type === "variant") ids.add(t.conceptId);
  }
  return ids;
}

/** Rótulo de denominador por dimensão, no recorte pedido. */
function denominatorLabel(dim: Dimension, scopeNoun: string, denominator: number): string {
  switch (dim) {
    case "contact":
    case "applied":
      return `${denominator} ${scopeNoun}`;
    case "practiced":
    case "demonstrated":
      return `${denominator} ${scopeNoun} have practice tasks`;
    case "transferred":
    case "retained":
      return `${denominator} ${scopeNoun} have transfer variants`;
  }
}

function stat(count: number, denominator: number, label: string): DimensionStat {
  return { count, denominator, denominatorLabel: label };
}

/**
 * Visão completa do progresso. Sem porcentagem global por desenho: o tipo
 * de retorno não oferece campo para ela (testado).
 */
export interface ProgressOverview {
  totals: Record<Dimension, DimensionStat>;
  /** Agregado por categoria (competência), com os mesmos denominadores honestos. */
  byCategory: {
    cat: string;
    concepts: number;
    dims: Record<Dimension, DimensionStat>;
  }[];
  /** Só conceitos com qualquer atividade registrada (inspecionáveis). */
  active: {
    conceptId: number;
    dims: Record<Dimension, boolean>;
  }[];
}

export function progressOverview(state: LearningState): ProgressOverview {
  const withTasks = conceptsWithTasks();
  const withVariant = conceptsWithVariant();

  // Conceitos ativos: qualquer evidência registrada.
  const activeIds = new Set<number>([
    ...Object.keys(state.contact).map(Number),
    ...state.attempts.map((a) => a.conceptId),
    ...Object.keys(state.application).map(Number),
  ]);

  const active = [...activeIds]
    .sort((a, b) => a - b)
    .map((conceptId) => ({
      conceptId,
      dims: conceptDimensions(state, conceptId),
    }));

  // Totais por dimensão, calculados sobre os 111 conceitos canônicos.
  const counts: Record<Dimension, number> = {
    contact: 0,
    practiced: 0,
    demonstrated: 0,
    transferred: 0,
    retained: 0,
    applied: 0,
  };
  const categoryConcepts = new Map<string, number[]>();
  for (const c of CONCEPT_INDEX) {
    const dims = conceptDimensions(state, c.id);
    for (const d of DIMENSIONS) {
      if (dims[d]) counts[d] += 1;
    }
    const list = categoryConcepts.get(c.cat) ?? [];
    list.push(c.id);
    categoryConcepts.set(c.cat, list);
  }

  const total = CONCEPT_INDEX.length;
  const denominators: Record<Dimension, number> = {
    contact: total,
    practiced: withTasks.size,
    demonstrated: withTasks.size,
    transferred: withVariant.size,
    retained: withVariant.size,
    applied: total,
  };

  const totals = {} as Record<Dimension, DimensionStat>;
  for (const d of DIMENSIONS) {
    totals[d] = stat(
      counts[d],
      denominators[d],
      denominatorLabel(d, "concepts", denominators[d]),
    );
  }

  const byCategory = [...categoryConcepts.entries()]
    .map(([cat, ids]) => {
      const catCounts: Record<Dimension, number> = {
        contact: 0,
        practiced: 0,
        demonstrated: 0,
        transferred: 0,
        retained: 0,
        applied: 0,
      };
      for (const id of ids) {
        const dims = conceptDimensions(state, id);
        for (const d of DIMENSIONS) {
          if (dims[d]) catCounts[d] += 1;
        }
      }
      const catDenominators: Record<Dimension, number> = {
        contact: ids.length,
        practiced: ids.filter((id) => withTasks.has(id)).length,
        demonstrated: ids.filter((id) => withTasks.has(id)).length,
        transferred: ids.filter((id) => withVariant.has(id)).length,
        retained: ids.filter((id) => withVariant.has(id)).length,
        applied: ids.length,
      };
      const dims = {} as Record<Dimension, DimensionStat>;
      for (const d of DIMENSIONS) {
        dims[d] = stat(
          catCounts[d],
          catDenominators[d],
          denominatorLabel(d, "concepts", catDenominators[d]),
        );
      }
      return { cat, concepts: ids.length, dims };
    })
    .sort((a, b) => b.concepts - a.concepts || a.cat.localeCompare(b.cat));

  return { totals, byCategory, active };
}

// Import colocado ao fim para manter a leitura do contrato no topo do arquivo.
import { CONCEPTS as CONCEPT_INDEX } from "@/lib/concepts";
