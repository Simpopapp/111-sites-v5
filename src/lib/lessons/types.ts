// Contrato editorial da lição v2 (PRD project2 D1). A camada lessons é separada
// do arquivo gerado `concepts.ts` para que melhorias editoriais sobrevivam a
// regenerações. Ausência de campo = camada ainda não autorizada.

export type InstrumentKind =
  | "request-flow"
  | "latency-histogram"
  | "state-machine"
  | "event-track"
  | "query-explainer"
  | "timeline"
  | "table";

export interface RepresentationSpec {
  kind: InstrumentKind;
  /** O que o aluno deve observar para entender a causa. */
  caption: string;
  /** Dados do instrumento (shape tipado por kind em components/instruments). */
  data: Record<string, unknown>;
  /** Versão textual/tabela equivalente (a11y — PRD D13). */
  textEquivalent: string;
}

export interface Lesson {
  /** Id canônico do conceito (1..111). */
  id: number;
  /** Versão editorial, ex. "2.1". */
  rev: string;
  /** Ação observável em contexto definido. */
  objective: string;
  /** Pré-requisitos canônicos com atalho de retomada na aula. */
  prereqIds: number[];
  mentalModel: {
    /** Definição técnica correta. */
    definition: string;
    /** Analogia revisada (ELI10 é entrada, não limite). */
    analogy: string;
    /** Obrigatório: onde a analogia quebra (PRD D1 / planejamento §3.1.6). */
    analogyLimits: string;
    /** [elemento técnico, elemento da metáfora]. */
    correspondence: [string, string][];
  };
  scenario: {
    system: string;
    data: string;
    symptom: string;
    constraints: string[];
    baseline: string;
  };
  representation: RepresentationSpec;
  /** Exemplo trabalhado com raciocínio intermediário, não só a solução. */
  worked: { decision: string; reasoning: string[] };
  contrast: { alternative: string; tradeoff: string; whenNotToUse: string }[];
  misconceptions: { wrong: string; discriminant: string; counterexample: string }[];
  /** Ids do motor de prática (src/lib/exercises). */
  practiceIds: string[];
  /** O que sustenta dizer "aprendi". */
  evidenceCriteria: string[];
  transfer: { variant: string; domain: string };
  provenance: { reviewed: boolean; notes: string };
}
