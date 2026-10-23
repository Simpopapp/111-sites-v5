import { describe, expect, it } from "vitest";
import { CONCEPTS } from "@/lib/concepts";
import { LESSONS } from "@/lib/lessons";
import { LESSON_COVERAGE } from "@/lib/lessons/coverage";
import { getTask } from "@/lib/exercises-data";

// Contrato da camada editorial (PRD project2 D1). Com cobertura vazia os
// testes de vacuidade passam; quando s1 autoriza lições, eles passam a
// exigir os campos obrigatórios de cada lição.

const conceptIds = new Set(CONCEPTS.map((c) => c.id));

describe("lessons — contrato editorial", () => {
  it("nenhum id duplicado entre arquivos de categoria", () => {
    const ids = LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("toda lição referencia um conceito canônico 1..111", () => {
    for (const l of LESSONS) {
      expect(conceptIds.has(l.id), `lição ${l.id} sem conceito canônico`).toBe(true);
    }
  });

  it("cobertura deriva dos arquivos, ordenada e sem duplicata", () => {
    expect(LESSON_COVERAGE).toEqual([...new Set(LESSONS.map((l) => l.id))].sort((a, b) => a - b));
  });

  it("campos obrigatórios do contrato de lição não são vazios", () => {
    for (const l of LESSONS) {
      expect(l.rev.trim(), `rev de ${l.id}`).not.toBe("");
      expect(l.objective.trim(), `objective de ${l.id}`).not.toBe("");
      expect(l.mentalModel.definition.trim(), `definition de ${l.id}`).not.toBe("");
      expect(l.mentalModel.analogy.trim(), `analogy de ${l.id}`).not.toBe("");
      // A analogia sempre declara onde quebra (lacuna §3.1.6 do planejamento).
      expect(l.mentalModel.analogyLimits.trim(), `analogyLimits de ${l.id}`).not.toBe("");
      expect(l.mentalModel.correspondence.length, `correspondence de ${l.id}`).toBeGreaterThan(0);
      expect(l.scenario.constraints.length, `constraints de ${l.id}`).toBeGreaterThan(0);
      expect(l.worked.reasoning.length, `worked de ${l.id}`).toBeGreaterThan(0);
      expect(l.contrast.length, `contrast de ${l.id}`).toBeGreaterThan(0);
      expect(l.misconceptions.length, `misconceptions de ${l.id}`).toBeGreaterThan(0);
      for (const m of l.misconceptions) {
        expect(m.counterexample.trim(), `counterexample de ${l.id}`).not.toBe("");
      }
      expect(l.evidenceCriteria.length, `evidenceCriteria de ${l.id}`).toBeGreaterThan(0);
      expect(l.transfer.domain.trim(), `transfer.domain de ${l.id}`).not.toBe("");
    }
  });

  it("toda tarefa de prática referenciada existe no motor", () => {
    for (const l of LESSONS) {
      for (const pid of l.practiceIds) {
        expect(getTask(pid), `practiceIds de ${l.id}: ${pid} inexistente`).toBeDefined();
      }
    }
  });
});
