import { LESSONS } from "./index";

/**
 * Ids canônicos com lição editorial completa (PRD D2). Derivado dos arquivos
 * de lições; nunca hardcode. `/concepts/$id` usa isto para decidir o render.
 */
export const LESSON_COVERAGE: number[] = LESSONS.map((l) => l.id).sort(
  (a, b) => a - b,
);

export function coverageCount(): number {
  return LESSON_COVERAGE.length;
}
