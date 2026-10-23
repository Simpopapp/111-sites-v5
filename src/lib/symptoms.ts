// Mapa de sintomas da biblioteca (PRD project2 §16). A busca da home casa
// sintoma/sinônimo além do nome; cada entrada explica o motivo da
// correspondência (lead) e diferencia aula, comparação e laboratório.

import type { SandboxId } from "@/lib/simulators";

export interface SymptomEntry {
  /** Termos que disparam a correspondência (case-insensitive, substring). */
  query: string[];
  conceptIds: number[];
  labId?: SandboxId;
  /** Motivo da correspondência, exibido no resultado (planejamento §9.2). */
  lead: string;
}

export const SYMPTOMS: SymptomEntry[] = [
  {
    query: ["slow", "lento", "página lenta", "lentidão"],
    conceptIds: [27, 25, 26, 2, 91],
    labId: "nplusone",
    lead: "Redundant round-trips, cache or returned volume — start from the N+1 visualizer.",
  },
  {
    query: ["queue growing", "fila cresce", "acumulando", "backlog"],
    conceptIds: [15, 16, 17, 20],
    labId: "pubsub",
    lead: "Compare arrival and processing rates before touching capacity.",
  },
  {
    query: ["429", "rate limit", "throttled", "bloqueado"],
    conceptIds: [1, 13],
    labId: "ratelimit",
    lead: "Burst or sustained rate? The bucket shows the difference.",
  },
  {
    query: ["downstream failing", "dependência falhando", "cascading"],
    conceptIds: [10, 11, 12],
    labId: "circuit",
    lead: "Protection, recovery and the cost of rejecting temporarily.",
  },
  {
    query: ["hacked", "injection", "query manipulada"],
    conceptIds: [78, 79],
    labId: "sqli",
    lead: "Where input becomes code — and how parameterization keeps the boundary.",
  },
  {
    query: ["p99", "tail", "outlier", "some users slow"],
    conceptIds: [93, 94, 91, 92],
    labId: "tail",
    lead: "The average hides the tail; read the distribution before optimizing.",
  },
];

/**
 * Sintomas cuja consulta casa com o texto digitado. A correspondência é
 * tolerante: substring em qualquer direção ou palavra compartilhada —
 * "queue grows" casa com "queue growing", "fila cresce" com "fila".
 */
export function matchSymptoms(query: string): SymptomEntry[] {
  const needle = query.toLowerCase().trim();
  if (!needle) return [];
  const needleWords = needle.split(/[^a-z0-9áàâãéêíóôõúçñ+]+/i).filter(Boolean);
  const sharesWord = (term: string) => {
    const termWords = term.toLowerCase().split(/[^a-z0-9áàâãéêíóôõúçñ+]+/i).filter(Boolean);
    return termWords.some((w) => needleWords.includes(w));
  };
  return SYMPTOMS.filter((s) =>
    s.query.some((q) => {
      const t = q.toLowerCase();
      return t.includes(needle) || needle.includes(t) || sharesWord(t);
    }),
  );
}
