import { describe, expect, it } from "vitest";
import { CONCEPTS } from "@/lib/concepts";
import { RELATIONS, isRelationKind } from "@/lib/relations";

// Contrato de relações tipadas (PRD project2 D4): sem relação órfã, sem
// "relacionado" solto.

const conceptIds = new Set(CONCEPTS.map((c) => c.id));

describe("relations — seed D4", () => {
  it("seed obrigatória presente (pares do PRD)", () => {
    const pairs = new Set(RELATIONS.map((r) => `${r.from}->${r.to}:${r.kind}`));
    for (const p of [
      "1->13:contrast",
      "10->12:composition",
      "11->13:composition",
      "2->27:contrast",
      "25->27:prereq",
      "15->16:contrast",
      "16->17:composition",
      "93->92:composition",
    ]) {
      expect(pairs.has(p), `relação ausente: ${p}`).toBe(true);
    }
  });

  it("nenhuma relação órfã (from e to existem no catálogo)", () => {
    for (const r of RELATIONS) {
      expect(conceptIds.has(r.from), `from ${r.from}`).toBe(true);
      expect(conceptIds.has(r.to), `to ${r.to}`).toBe(true);
    }
  });

  it("kinds são válidos e guard rejeita inválidos", () => {
    for (const r of RELATIONS) expect(isRelationKind(r.kind)).toBe(true);
    expect(isRelationKind("related")).toBe(false);
  });
});
