import type { Lesson } from "./types";
import { LESSONS_TRAFFIC } from "./traffic";
import { LESSONS_PERFORMANCE } from "./performance";
import { LESSONS_RESILIENCE } from "./resilience";
import { CONCEPTS } from "@/lib/concepts";

/** Todas as lições autorizadas, agregadas por categoria (PRD D1). */
export const LESSONS: Lesson[] = [
  ...LESSONS_TRAFFIC,
  ...LESSONS_PERFORMANCE,
  ...LESSONS_RESILIENCE,
];

const byId = new Map(LESSONS.map((l) => [l.id, l]));

export function getLesson(id: number): Lesson | undefined {
  return byId.get(id);
}

export function hasLesson(id: number): boolean {
  return byId.has(id);
}

/** Valida que toda lição referencia um conceito canônico existente (1..111). */
export function lessonConceptExists(id: number): boolean {
  return CONCEPTS.some((c) => c.id === id);
}
