import { describe, expect, it } from "vitest";
import { SYMPTOMS, matchSymptoms } from "@/lib/symptoms";
import { SANDBOXES } from "@/lib/simulators";
import { CONCEPTS } from "@/lib/concepts";

// Mapa de sintomas (PRD project2 §16): entradas válidas e lead não vazio.
describe("symptoms — contrato do mapa", () => {
  it("cada entry tem conceptIds válidos (1..111) e lead não vazio", () => {
    expect(SYMPTOMS.length).toBeGreaterThanOrEqual(5);
    for (const s of SYMPTOMS) {
      expect(s.query.length, JSON.stringify(s.query)).toBeGreaterThan(0);
      expect(s.lead.trim().length, s.lead).toBeGreaterThan(0);
      expect(s.conceptIds.length).toBeGreaterThan(0);
      for (const id of s.conceptIds) {
        expect(
          CONCEPTS.some((c) => c.id === id),
          `conceptId ${id} inválido em "${s.lead}"`,
        ).toBe(true);
      }
    }
  });

  it("todo labId referenciado existe", () => {
    const labIds = new Set(SANDBOXES.map((s) => s.id));
    for (const s of SYMPTOMS) {
      if (s.labId) expect(labIds.has(s.labId), s.labId).toBe(true);
    }
  });

  it("matchSymptoms casa por sintoma e sinônimo", () => {
    expect(matchSymptoms("queue grows").length).toBeGreaterThan(0);
    expect(matchSymptoms("slow").map((s) => s.labId)).toContain("nplusone");
    expect(matchSymptoms("")).toEqual([]);
    expect(matchSymptoms("zzz-no-match")).toEqual([]);
  });
});
