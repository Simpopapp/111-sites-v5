import { describe, expect, it } from "vitest";
import { recommendNext, type MissionHint } from "@/lib/recommend";
import { emptyLearning, type LearningState } from "@/lib/learning";

// Gate D9/D11: recommendNext com motivo obrigatório e prioridade contratada
// (revisão pendente → lacuna de missão → etapa de percurso → desafio novo).
// Máximo 3 itens (sem fila punitiva — planejamento §14.4).

const HOUR = 60 * 60 * 1000;
const T0 = 1_000_000;

function stateWith(patch: Partial<LearningState>): LearningState {
  return { ...emptyLearning(), ...patch };
}

describe("recommendNext — prioridades e motivo obrigatório", () => {
  it("revisão pendente vem primeiro e explica o motivo de retenção", () => {
    const s = stateWith({
      reviews: [{ taskId: "t-2-variant", dueTs: T0 }],
    });
    const recs = recommendNext(s, undefined, { now: T0 + HOUR });
    expect(recs[0]!.kind).toBe("review");
    expect(recs[0]!.taskId).toBe("t-2-variant");
    expect(recs[0]!.reason.length).toBeGreaterThan(0);
  });

  it("revisão ainda não vencida não é recomendada", () => {
    const s = stateWith({
      reviews: [{ taskId: "t-2-variant", dueTs: T0 + 10 * HOUR }],
    });
    const recs = recommendNext(s, undefined, { now: T0 });
    expect(recs.some((r) => r.kind === "review")).toBe(false);
  });

  it("lacuna de missão ativa vem antes de percurso e desafio", () => {
    const hint: MissionHint = {
      slug: "charged-but-lost",
      title: "Charged but lost",
      stepTitle: "Repeat the charge",
      pendingConceptIds: [14],
    };
    const recs = recommendNext(emptyLearning(), undefined, {
      now: T0,
      missionHints: [hint],
    });
    expect(recs[0]!.kind).toBe("mission-gap");
    expect(recs[0]!.conceptId).toBe(14);
    expect(recs[0]!.reason).toContain("Repeat the charge");
  });

  it("sem revisão e sem missão: etapa de percurso; objetivo escolhe o percurso", () => {
    const recs = recommendNext(emptyLearning(), "my queue keeps growing", { now: T0 });
    expect(recs[0]!.kind).toBe("route-step");
    // Percurso "O trabalho está acumulando" começa em 15 (Message Queues).
    expect(recs[0]!.conceptId).toBe(15);
  });

  it("conceito já demonstrado não volta como etapa de percurso", () => {
    const s = stateWith({
      attempts: [
        { taskId: "t-11-predict", conceptId: 11, ts: T0, help: 0, criteria: { c1: true }, outcome: "met" },
      ],
    });
    const recs = recommendNext(s, "timeout", { now: T0 });
    const routeRec = recs.find((r) => r.kind === "route-step");
    expect(routeRec?.conceptId).not.toBe(11);
  });

  it("desafio sem tentativa entra como recomendação de prática", () => {
    const recs = recommendNext(emptyLearning(), undefined, { now: T0, limit: 4 });
    const challenge = recs.find((r) => r.kind === "challenge");
    expect(challenge).toBeDefined();
    expect(challenge!.reason).toContain("haven't attempted");
  });

  it("todo item tem label e reason não vazios; máximo 3", () => {
    const s = stateWith({
      reviews: [{ taskId: "t-2-variant", dueTs: T0 }],
    });
    const recs = recommendNext(s, undefined, { now: T0 + HOUR });
    expect(recs.length).toBeLessThanOrEqual(3);
    for (const r of recs) {
      expect(r.label.trim().length).toBeGreaterThan(0);
      expect(r.reason.trim().length).toBeGreaterThan(0);
      expect(r.href.startsWith("/")).toBe(true);
    }
  });
});
