// Relações com significado entre conceitos (PRD project2 D4). "Relacionado"
// solto não existe: cada relação declara o tipo e, quando útil, a nota de
// alcance. Seed obrigatório do contrato; expandível pelas lições.

export type RelationKind = "prereq" | "contrast" | "composition" | "context" | "practice";

export interface Relation {
  from: number;
  kind: RelationKind;
  to: number;
  /** Nota curta de alcance/motivo exibida no bloco "para continuar". */
  note?: string;
}

export const RELATIONS: Relation[] = [
  { from: 1, kind: "contrast", to: 13, note: "Rate limiting segura o lado que recebe; backoff segura o lado que insiste." },
  { from: 10, kind: "composition", to: 12, note: "O breaker decide repetir ou não usando a política de retry." },
  { from: 11, kind: "composition", to: 13, note: "Backoff espaça as tentativas que o timeout permite fazer." },
  { from: 2, kind: "contrast", to: 27, note: "Cache evita a ida; lote agrupa as idas — problemas diferentes." },
  { from: 25, kind: "prereq", to: 27, note: "JOIN é a resposta canônica ao padrão N+1." },
  { from: 15, kind: "contrast", to: 16, note: "Fila distribui trabalho; pub/sub distribui eventos — não são o mesmo desenho." },
  { from: 16, kind: "composition", to: 17, note: "A DLQ recebe o que o consumidor esgotou; recomeça por ela." },
  { from: 93, kind: "composition", to: 92, note: "Percentis só significam com a distribuição de latência explícita." },
];

const RELATION_KINDS: RelationKind[] = [
  "prereq",
  "contrast",
  "composition",
  "context",
  "practice",
];

export function isRelationKind(k: string): k is RelationKind {
  return (RELATION_KINDS as string[]).includes(k);
}

/** Relações saindo de um conceito, para o bloco "para continuar". */
export function relationsFrom(conceptId: number): Relation[] {
  return RELATIONS.filter((r) => r.from === conceptId);
}
