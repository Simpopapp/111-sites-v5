import type { Task } from "@/lib/exercises";
import { TASKS_TRAFFIC } from "./traffic";
import { TASKS_PERFORMANCE } from "./performance";
import { TASKS_RESILIENCE } from "./resilience";
import { TASKS_MISSIONS } from "./missions";

/** Registro único de tarefas de prática (PRD project2 D8). */
export const TASKS: Task[] = [
  ...TASKS_TRAFFIC,
  ...TASKS_PERFORMANCE,
  ...TASKS_RESILIENCE,
  ...TASKS_MISSIONS,
];

export function getTask(id: string): Task | undefined {
  return TASKS.find((t) => t.id === id);
}
