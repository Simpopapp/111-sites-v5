import { describe, expect, it } from "vitest";
import {
  migrateReadinessInto,
  parseLearning,
  emptyLearning,
  type LearningState,
} from "@/lib/learning";

describe("learning — parse tolerante", () => {
  it("raw nulo → estado vazio sem flag de corrupção", () => {
    const r = parseLearning(null);
    expect(r.corrupt).toBe(false);
    expect(r.state.contact).toEqual({});
  });

  it("json inválido → estado vazio + corrupt", () => {
    const r = parseLearning("{quebrado");
    expect(r.corrupt).toBe(true);
    expect(r.state).toEqual(emptyLearning());
  });

  it("ids fora do range 1..111 são descartados", () => {
    const r = parseLearning(JSON.stringify({ contact: { "0": 1, "5": 2, "200": 3 } }));
    expect(r.corrupt).toBe(false);
    expect(Object.keys(r.state.contact)).toEqual(["5"]);
  });
});

describe("learning — migração do readiness (1:1, autodeclaração)", () => {
  const base: LearningState = emptyLearning();

  it("herda o checklist antigo como application", () => {
    const next = migrateReadinessInto(base, JSON.stringify([1, 10, 200]), 1000);
    expect(Object.keys(next.application)).toEqual(["1", "10"]);
    expect(next.application[1]?.note).toContain("autodeclaração");
  });

  it("é idempotente: segundo merge não sobrescreve", () => {
    const first = migrateReadinessInto(base, JSON.stringify([2]), 1000);
    const second = migrateReadinessInto(first, JSON.stringify([2]), 9999);
    expect(second.application[2]?.ts).toBe(1000);
  });

  it("raw inválido não altera o estado", () => {
    const next = migrateReadinessInto(base, "{quebrado", 1000);
    expect(next).toBe(base);
  });

  it("raw nulo não altera o estado", () => {
    expect(migrateReadinessInto(base, null, 1000)).toBe(base);
  });
});
