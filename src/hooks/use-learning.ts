import { useCallback, useSyncExternalStore } from "react";
import {
  emptyLearning,
  loadLearningMigrated,
  saveLearning,
  RETENTION_INTERVAL_MS,
  type Attempt,
  type LearningState,
} from "@/lib/learning";
import { getTask } from "@/lib/exercises-data";

/**
 * Store compartilhado de aprendizagem (PRD project2 D7): header, aula,
 * progresso e missões veem o MESMO estado. Hydration-safe: o snapshot de
 * servidor é sempre o estado neutro congelado e o estado real entra após
 * a hidratação (regra D3 herdada do Project 1).
 */

let state: LearningState = emptyLearning();
let hydratedFlag = false;
const listeners = new Set<() => void>();

function ensureLoaded() {
  if (!hydratedFlag) {
    const { state: loaded } = loadLearningMigrated();
    state = loaded;
    hydratedFlag = true;
  }
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): LearningState {
  ensureLoaded();
  return state;
}

// Snapshot de servidor SEMPRE neutro e estável (mesma referência).
const SERVER_SNAPSHOT: LearningState = emptyLearning();

function getServerSnapshot(): LearningState {
  return SERVER_SNAPSHOT;
}

function commit(next: LearningState) {
  state = next;
  saveLearning(next);
  for (const listener of listeners) listener();
}

export function useLearning() {
  const learning = useSyncExternalStore<LearningState>(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const markContact = useCallback((conceptId: number, ts: number = Date.now()) => {
    ensureLoaded();
    commit({ ...state, contact: { ...state.contact, [conceptId]: ts } });
  }, []);

  /**
   * Grava a tentativa e mantém a retenção honesta (D9): um `variant`
   * concluído com met agenda a recuperação para +72h (hipótese de
   * calibração declarada na UI); uma recuperação bem-sucedida em/after
   * dueTs fecha o item — sem fila punitiva.
   */
  const recordAttempt = useCallback((attempt: Attempt) => {
    ensureLoaded();
    const task = getTask(attempt.taskId);
    let reviews = state.reviews;
    if (task?.type === "variant" && attempt.outcome === "met") {
      const pending = reviews.find(
        (r) => r.taskId === attempt.taskId && r.doneTs === undefined,
      );
      if (pending) {
        if (attempt.ts >= pending.dueTs) {
          reviews = reviews.map((r) =>
            r.taskId === attempt.taskId && r.doneTs === undefined
              ? { ...r, doneTs: attempt.ts }
              : r,
          );
        }
      } else {
        reviews = [
          ...reviews,
          { taskId: attempt.taskId, dueTs: attempt.ts + RETENTION_INTERVAL_MS },
        ];
      }
    }
    commit({
      ...state,
      attempts: [...state.attempts, attempt],
      reviews,
    });
  }, []);

  const setApplication = useCallback(
    (conceptId: number, record: { ts: number; note?: string; nA?: boolean } | null) => {
      ensureLoaded();
      const application = { ...state.application };
      if (record === null) delete application[conceptId];
      else application[conceptId] = record;
      commit({ ...state, application });
    },
    [],
  );

  const setMission = useCallback(
    (slug: string, progress: { step: string; dossier?: string; ts: number }) => {
      ensureLoaded();
      commit({
        ...state,
        missions: { ...state.missions, [slug]: progress },
      });
    },
    [],
  );

  const setObjective = useCallback((goal: string | null) => {
    ensureLoaded();
    if (goal) {
      commit({ ...state, objective: { goal, ts: Date.now() } });
    } else {
      const { objective: _drop, ...rest } = state;
      commit(rest);
    }
  }, []);

  return {
    learning,
    hydrated: hydratedFlag,
    markContact,
    recordAttempt,
    setApplication,
    setMission,
    setObjective,
  };
}
