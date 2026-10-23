import { describe, expect, it } from "vitest";
import { evaluate, taskQualityIssues, type Task } from "@/lib/exercises";
import { TASKS } from "@/lib/exercises-data";

const base: Task = {
  id: "t1",
  conceptId: 11,
  type: "predict",
  prompt: "Uma chamada de 30 s espera uma resposta com timeout de 10 s. O que o servidor da loja sabe sobre o pedido?",
  rubric: {
    criteria: [
      {
        key: "c1",
        label: "Reconhece que o resultado é desconhecido, não confirmado como falha",
        cause: "Confundiu timeout com confirmação de falha: expirar não diz o que aconteceu do outro lado.",
        check: (a) => a.picked?.includes("unknown") ?? false,
      },
      {
        key: "c2",
        label: "Aponta a consequência (pedido pode ter sido processado)",
        cause: "Ignorou a possibilidade de execução bem-sucedida após o corte.",
        check: (a) => a.picked?.includes("may-processed") ?? false,
      },
    ],
    expected: "Timeout encerra a espera do cliente; o servidor do processador pode ter concluído a cobrança.",
  },
  helpLevels: [
    "Observe quem encerra a espera e quem executa o trabalho.",
    "As duas partes têm relógios diferentes.",
    "O corte acontece antes ou depois da cobrança?",
  ],
  options: [
    { key: "unknown", label: "Ele não sabe: o resultado é desconhecido" },
    { key: "failed", label: "Ele sabe que falhou" },
    { key: "may-processed", label: "O pedido pode ter sido processado" },
  ],
};

describe("exercises — motor de prática", () => {
  it("met quando todos os critérios passam", () => {
    const r = evaluate(base, { picked: ["unknown", "may-processed"] }, 0);
    expect(r.outcome).toBe("met");
    expect(r.feedback.causes).toEqual([]);
  });

  it("partial quando um critério quebra e nomeia a causa", () => {
    const r = evaluate(base, { picked: ["unknown", "failed"] }, 0);
    expect(r.outcome).toBe("partial");
    expect(r.feedback.causes).toEqual([base.rubric.criteria[1]!.cause]);
    expect(r.feedback.nextStep).toContain("variante");
  });

  it("missed quando nenhum critério passa", () => {
    const r = evaluate(base, { picked: ["failed"] }, 0);
    expect(r.outcome).toBe("missed");
    expect(r.feedback.verdict).toContain("Nenhum critério");
  });

  it("alternativa válida conta como met e explica o trade-off", () => {
    const optimistic = base.rubric.criteria[0]!;
    const pessimistic = base.rubric.criteria[1]!;
    const t: Task = {
      ...base,
      type: "compare",
      rubric: {
        ...base.rubric,
        criteria: [
          {
            ...optimistic,
            key: "choice-approach",
            check: (a) => a.picked?.includes("optimistic") ?? false,
          },
          {
            ...pessimistic,
            key: "choice-tradeoff",
            check: (a) => a.picked?.includes("pessimistic") ?? false,
          },
        ],
        validAlternatives: [
          {
            picks: ["optimistic", "pessimistic"],
            tradeoff: "Ambas respeitam as restrições: a pessimista sacrifica concorrência pela simplicidade.",
          },
        ],
      },
    };
    const r = evaluate(t, { picked: ["optimistic", "pessimistic"] }, 1);
    expect(r.outcome).toBe("met");
    expect(r.feedback.tradeoffs).toContain("pessimista");
  });

  it("rubric.nextStep sobrepõe o fallback do motor", () => {
    const t: Task = { ...base, rubric: { ...base.rubric, nextStep: "Compare com a bancada do breaker." } };
    const r = evaluate(t, { picked: ["unknown", "may-processed"] }, 0);
    expect(r.feedback.nextStep).toBe("Compare com a bancada do breaker.");
  });
});

describe("exercises — registro de tarefas (PRD project2 D8)", () => {
  it("todas as tarefas autorizadas passam na checagem de qualidade", () => {
    expect(TASKS.length).toBeGreaterThanOrEqual(10);
    for (const t of TASKS) {
      expect(taskQualityIssues(t), `tarefa ${t.id}`).toEqual([]);
    }
  });

  it("ids únicos no formato t-<conceptId>-<tipo> e cobrindo os 6 tipos", () => {
    const ids = TASKS.map((t) => t.id);
    expect(new Set(ids).size).toBe(ids.length);
    const types = new Set(TASKS.map((t) => t.type));
    for (const kind of ["predict", "order", "compare", "find-flaw", "variant", "choose-info"]) {
      expect(types.has(kind as Task["type"]), `tipo ausente: ${kind}`).toBe(true);
    }
    for (const t of TASKS) {
      expect(t.id).toMatch(new RegExp(`^t-${t.conceptId}-(predict|order|compare|find-flaw|variant|choose-info)$`));
    }
  });
});

describe("exercises — qualidade editorial (proibições §6.3)", () => {
  it("tarefa completa não tem problemas", () => {
    expect(taskQualityIssues(base)).toEqual([]);
  });

  it("reprova resposta explícita no rótulo da opção", () => {
    const bad: Task = {
      ...base,
      options: [
        { key: "unknown", label: "resultado desconhecido c1" },
        { key: "failed", label: "falhou" },
      ],
    };
    expect(taskQualityIssues(bad).join(" ")).toContain("c1");
  });

  it("reprova critério sem causa de equívoco", () => {
    const first = base.rubric.criteria[0]!;
    const bad: Task = {
      ...base,
      rubric: {
        ...base.rubric,
        criteria: [{ ...first, cause: "" }],
      },
    };
    expect(taskQualityIssues(bad).join(" ")).toContain("sem causa");
  });
});
