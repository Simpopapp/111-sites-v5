// Motor de prática (PRD project2 D8). Lógica pura: as tarefas vivem em
// src/lib/exercises-data/ por categoria; este módulo só avalia e gera
// feedback diagnóstico (decisão tomada → critério → causa → próxima ação).

export type TaskType =
  | "predict"
  | "order"
  | "compare"
  | "find-flaw"
  | "variant"
  | "choose-info";

export interface Option {
  key: string;
  label: string;
}

/** Resposta do aluno; campos opcionais conforme o tipo de tarefa. */
export interface Answer {
  picked?: string[];
  order?: string[];
  text?: string;
}

export interface RubricCriterion {
  key: string;
  label: string;
  /** Causa provável do equívoco quando este critério quebra (feedback D8). */
  cause: string;
  check: (a: Answer) => boolean;
}

export interface ValidAlternative {
  picks: string[];
  tradeoff: string;
}

export interface Rubric {
  criteria: RubricCriterion[];
  /** Combinações de picks aceitas com trade-off explicado (planejamento §9.7). */
  validAlternatives?: ValidAlternative[];
  /** Raciocínio comentado revelado no nível 3 de apoio. */
  expected: string;
  /** Próxima ação específica; o motor tem fallback genérico. */
  nextStep?: string;
}

export interface Task {
  id: string;
  conceptId: number;
  type: TaskType;
  prompt: string;
  context?: string;
  options?: Option[];
  rubric: Rubric;
  /** Pistas graduadas (planejamento §6.2). Índice = nível de apoio. */
  helpLevels: string[];
}

export interface Feedback {
  verdict: string;
  causes: string[];
  nextStep: string;
  tradeoffs?: string;
}

export type Outcome = "met" | "partial" | "missed";

export interface Evaluation {
  outcome: Outcome;
  criteria: Record<string, boolean>;
  feedback: Feedback;
}

function sameSet(a: string[], b: string[]): boolean {
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.length === sb.length && sa.every((v, i) => v === sb[i]);
}

export function evaluate(task: Task, answer: Answer, helpUsed: number): Evaluation {
  const criteria: Record<string, boolean> = {};
  for (const c of task.rubric.criteria) {
    criteria[c.key] = c.check(answer);
  }

  // Alternativa válida: se os picks casam com uma combinação aceita, os
  // critérios de escolha contam como atendidos e o trade-off é explicado.
  let tradeoffs: string | undefined;
  if (answer.picked && task.rubric.validAlternatives) {
    for (const alt of task.rubric.validAlternatives) {
      if (sameSet(answer.picked, alt.picks)) {
        for (const c of task.rubric.criteria) {
          if (c.key.startsWith("choice")) criteria[c.key] = true;
        }
        tradeoffs = alt.tradeoff;
        break;
      }
    }
  }

  const values = Object.values(criteria);
  const passed = values.filter(Boolean).length;
  const outcome: Outcome =
    passed === values.length ? "met" : passed === 0 ? "missed" : "partial";

  const causes = task.rubric.criteria
    .filter((c) => !criteria[c.key])
    .map((c) => c.cause);

  const verdict =
    outcome === "met"
      ? "Sua decisão atende aos critérios da tarefa."
      : outcome === "partial"
        ? "Sua decisão atende parte dos critérios; os não atendidos estão abaixo."
        : "Nenhum critério foi atendido; o raciocínio comentado está nos níveis de apoio.";

  const nextStep =
    task.rubric.nextStep ??
    (outcome === "met"
      ? "Tente a variante de transferência desta aula para consolidar."
      : "Revise o modelo mental e tente a variante — não repita a mesma pergunta.");

  const feedback: Feedback = { verdict, causes, nextStep };
  if (tradeoffs !== undefined) feedback.tradeoffs = tradeoffs;

  return {
    outcome,
    criteria,
    feedback,
  };
}

/**
 * Checagens de qualidade editorial (proibições do planejamento §6.3).
 * Retorna problemas; vazio = tarefa aprovada.
 */
export function taskQualityIssues(task: Task): string[] {
  const issues: string[] = [];
  if (!task.prompt.trim()) issues.push("prompt vazio");
  if (!task.helpLevels.length) issues.push("sem níveis de apoio");
  if (!task.rubric.criteria.length) issues.push("sem critérios");
  for (const c of task.rubric.criteria) {
    if (!c.cause.trim()) issues.push(`critério ${c.key} sem causa de equívoco`);
    if (!c.label.trim()) issues.push(`critério ${c.key} sem rótulo`);
  }
  if (task.options) {
    if (task.options.length < 2) issues.push("menos de 2 opções");
    const labels = task.options.map((o) => o.label.toLowerCase());
    for (const c of task.rubric.criteria) {
      if (labels.some((l) => l.includes(c.key.toLowerCase()))) {
        issues.push(`resposta explícita no rótulo (critério ${c.key})`);
      }
    }
    // Alternativa caricatural: rótulo contendo "nunca faça" / "sempre faça".
    for (const l of labels) {
      if (/always (use|never)/i.test(l)) issues.push("alternativa caricatural");
    }
  }
  return issues;
}
