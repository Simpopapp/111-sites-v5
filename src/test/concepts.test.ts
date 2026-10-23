import { describe, expect, it } from "vitest";
import { CONCEPTS, CONCEPT_CATEGORIES, TOTAL_CONCEPTS, getConcept } from "@/lib/concepts";

// Gate G1 (PRD seção 10): integridade dos 111 conceitos extraídos da fonte.
describe("concepts dataset", () => {
  it("has exactly 111 concepts in canonical order 1..111", () => {
    expect(TOTAL_CONCEPTS).toBe(111);
    expect(CONCEPTS).toHaveLength(111);
    CONCEPTS.forEach((c, index) => expect(c.id).toBe(index + 1));
  });

  it("has unique ids", () => {
    expect(new Set(CONCEPTS.map((c) => c.id)).size).toBe(111);
  });

  it("every concept has complete eli/risk/fix content (>= 20 chars)", () => {
    for (const c of CONCEPTS) {
      expect(c.name.length, `name @${c.id}`).toBeGreaterThanOrEqual(3);
      expect(c.eli.length, `eli @${c.id}`).toBeGreaterThanOrEqual(20);
      expect(c.risk.length, `risk @${c.id}`).toBeGreaterThanOrEqual(20);
      expect(c.fix.length, `fix @${c.id}`).toBeGreaterThanOrEqual(20);
    }
  });

  it("every category belongs to the canonical category list", () => {
    for (const c of CONCEPTS) {
      expect(CONCEPT_CATEGORIES, `cat @${c.id}`).toContain(c.cat);
    }
    expect(CONCEPT_CATEGORIES.length).toBeGreaterThanOrEqual(10);
  });

  it("getConcept resolves boundary ids and rejects invalid ones", () => {
    expect(getConcept(1)?.name).toBe("Rate Limiting");
    expect(getConcept(111)?.name).toBe("Postmortems");
    expect(getConcept(0)).toBeUndefined();
    expect(getConcept(112)).toBeUndefined();
  });
});
