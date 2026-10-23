import { describe, expect, it } from "vitest";
import {
  conceptDimensions,
  progressOverview,
  RETENTION_INTERVAL_MS,
  type Dimension,
} from "@/lib/progress";
import { emptyLearning, type Attempt, type LearningState } from "@/lib/learning";

// Gate D9 (PRD §5 F5): semântica exata das 6 dimensões, denominadores
// rotulados e nenhuma porcentagem global. Valores concretos do contrato.

const HOUR = 60 * 60 * 1000;
const T0 = 1_000_000;

function stateWith(patch: Partial<LearningState>): LearningState {
  return { ...emptyLearning(), ...patch };
}

function attempt(over: Partial<Attempt> & Pick<Attempt, "taskId" | "conceptId" | "ts">): Attempt {
  return { help: 0, criteria: { c1: true }, outcome: "met", ...over };
}

describe("progress — semântica D9 por dimensão", () => {
  it("Contato: entrada em learning.contact", () => {
    const s = stateWith({ contact: { 10: T0 } });
    expect(conceptDimensions(s, 10).contact).toBe(true);
    expect(conceptDimensions(s, 11).contact).toBe(false);
  });

  it("Prática: tentativa com outcome ≠ missed; só missed não conta", () => {
    const s = stateWith({
      attempts: [attempt({ taskId: "t-10-predict", conceptId: 10, ts: T0, outcome: "missed" })],
    });
    expect(conceptDimensions(s, 10).practiced).toBe(false);

    const s2 = stateWith({
      attempts: [attempt({ taskId: "t-10-predict", conceptId: 10, ts: T0, outcome: "partial" })],
    });
    expect(conceptDimensions(s2, 10).practiced).toBe(true);
  });

  it("Demonstrado: help ≤ 1 e todos os critérios true; help 2 não qualifica", () => {
    expect(
      conceptDimensions(stateWith({ attempts: [attempt({ taskId: "t-10-predict", conceptId: 10, ts: T0 })] }), 10).demonstrated,
    ).toBe(true);
    expect(
      conceptDimensions(stateWith({ attempts: [attempt({ taskId: "t-10-predict", conceptId: 10, ts: T0, help: 1 })] }), 10).demonstrated,
    ).toBe(true);
    expect(
      conceptDimensions(stateWith({ attempts: [attempt({ taskId: "t-10-predict", conceptId: 10, ts: T0, help: 2 })] }), 10).demonstrated,
    ).toBe(false);
    expect(
      conceptDimensions(stateWith({ attempts: [attempt({ taskId: "t-10-predict", conceptId: 10, ts: T0, help: 3 })] }), 10).demonstrated,
    ).toBe(false);

    const oneFalse = stateWith({
      attempts: [
        attempt({ taskId: "t-10-predict", conceptId: 10, ts: T0, criteria: { c1: true, c2: false }, outcome: "partial" }),
      ],
    });
    expect(conceptDimensions(oneFalse, 10).demonstrated).toBe(false);
  });

  it("Demonstrado: tentativa sem critérios não qualifica", () => {
    const s = stateWith({
      attempts: [attempt({ taskId: "t-10-predict", conceptId: 10, ts: T0, criteria: {} })],
    });
    expect(conceptDimensions(s, 10).demonstrated).toBe(false);
  });

  it("Transferido: tentativa de tarefa variant com outcome met", () => {
    expect(
      conceptDimensions(stateWith({ attempts: [attempt({ taskId: "t-2-variant", conceptId: 2, ts: T0 })] }), 2).transferred,
    ).toBe(true);

    expect(
      conceptDimensions(stateWith({ attempts: [attempt({ taskId: "t-2-predict", conceptId: 2, ts: T0 })] }), 2).transferred,
    ).toBe(false);

    expect(
      conceptDimensions(
        stateWith({ attempts: [attempt({ taskId: "t-2-variant", conceptId: 2, ts: T0, outcome: "missed" })] }),
        2,
      ).transferred,
    ).toBe(false);
  });

  it("Retido: review reagendada ≥ original + 72h e recuperação com met em/after dueTs", () => {
    const base = {
      attempts: [attempt({ taskId: "t-2-variant", conceptId: 2, ts: T0 })],
    };
    // Sem review: não retido.
    expect(conceptDimensions(stateWith(base), 2).retained).toBe(false);

    // Review dentro de 72h do original: intervalo insuficiente.
    const tooSoon = stateWith({
      ...base,
      reviews: [{ taskId: "t-2-variant", dueTs: T0 + 24 * HOUR, doneTs: T0 + 25 * HOUR }],
    });
    expect(conceptDimensions(tooSoon, 2).retained).toBe(false);

    // Review ≥ 72h e recuperação bem-sucedida após dueTs.
    const retained = stateWith({
      ...base,
      reviews: [{ taskId: "t-2-variant", dueTs: T0 + RETENTION_INTERVAL_MS }],
      attempts: [
        ...base.attempts,
        attempt({ taskId: "t-2-variant", conceptId: 2, ts: T0 + RETENTION_INTERVAL_MS + HOUR }),
      ],
    });
    expect(conceptDimensions(retained, 2).retained).toBe(true);

    // Review ≥ 72h mas sem tentativa posterior com met.
    const noRecovery = stateWith({
      ...base,
      reviews: [{ taskId: "t-2-variant", dueTs: T0 + RETENTION_INTERVAL_MS }],
    });
    expect(conceptDimensions(noRecovery, 2).retained).toBe(false);
  });

  it("Aplicação declarada: entrada em application (autodeclaração)", () => {
    const s = stateWith({ application: { 27: { ts: T0 } } });
    expect(conceptDimensions(s, 27).applied).toBe(true);
    expect(conceptDimensions(s, 2).applied).toBe(false);
  });

  it("estado vazio: todas as dimensões falsas", () => {
    const dims = conceptDimensions(emptyLearning(), 10);
    expect(Object.values(dims).every((v) => !v)).toBe(true);
  });
});

describe("progress — visão agregada e denominadores rotulados", () => {
  it("denominadores são honestos por dimensão", () => {
    const o = progressOverview(emptyLearning());
    expect(o.totals.contact.denominator).toBe(111);
    expect(o.totals.applied.denominator).toBe(111);
    // Prática/Demonstrado só contam onde existe tarefa; Transferido/Retido
    // só onde existe variante — nunca 111 como denominador implícito.
    expect(o.totals.practiced.denominator).toBeGreaterThan(0);
    expect(o.totals.practiced.denominator).toBeLessThan(111);
    expect(o.totals.transferred.denominator).toBeGreaterThan(0);
    expect(o.totals.practiced.denominatorLabel).toContain("have practice tasks");
    expect(o.totals.transferred.denominatorLabel).toContain("have transfer variants");
  });

  it("contagem reflete o estado; ativos ficam inspecionáveis", () => {
    const s = stateWith({
      contact: { 10: T0, 11: T0, 27: T0 },
      application: { 10: { ts: T0 } },
    });
    const o = progressOverview(s);
    expect(o.totals.contact.count).toBe(3);
    expect(o.totals.applied.count).toBe(1);
    expect(o.totals.practiced.count).toBe(0);
    expect(o.active.map((a) => a.conceptId)).toEqual([10, 11, 27]);
  });

  it("agregado por categoria usa o denominador do recorte", () => {
    const o = progressOverview(emptyLearning());
    const traffic = o.byCategory.find((c) => c.cat === "Traffic");
    expect(traffic).toBeDefined();
    expect(traffic!.concepts).toBeGreaterThan(0);
    // Denominador de prática em Traffic ≤ nº de conceitos da categoria.
    expect(traffic!.dims.practiced.denominator).toBeLessThanOrEqual(traffic!.concepts);
  });

  it("a visão não expõe porcentagem global nem selo de prontidão", () => {
    const o = progressOverview(emptyLearning());
    const serialized = JSON.stringify(o);
    expect(serialized).not.toContain("percent");
    expect(serialized).not.toContain("Mission ready");
    expect(serialized).not.toContain("readiness");
  });
});
