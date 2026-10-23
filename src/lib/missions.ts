// Contrato de missões integradas (PRD project2 D10). O contrato (tipos,
// slugs, pré-requisitos, derivação de hints) é fixado ANTES da onda de
// produção (F7/s7-missoes): esta onda preenche os steps e as rotas contra
// este contrato — sem mudar nomes, slugs ou a assinatura das funções.

import type { SandboxId } from "@/lib/simulators";
import type { MissionHint } from "@/lib/recommend";
import type { LearningState } from "@/lib/learning";

export type MissionStepKind =
  | "briefing"
  | "predict"
  | "experiment"
  | "decide"
  | "transfer"
  | "dossier";

export interface MissionStep {
  id: string;
  kind: MissionStepKind;
  title: string;
  body: string;
  /** Etapa de experimento reusa a bancada do /labs/$id. */
  labId?: SandboxId;
  /** Etapa de prática usa o motor de tarefas (D8). */
  taskId?: string;
  /** Evidência exigida para avançar (critério, nunca screenshot). */
  needsEvidence?: string;
}

export interface Mission {
  slug: string;
  title: string;
  /** Problema reconhecível (planejamento §9.1) — nunca revela o padrão. */
  problem: string;
  /** Produto de aprendizagem (planejamento §12). */
  product: string;
  /** Pré-requisitos canônicos; lacunas alimentam recommendNext (D11). */
  prereqConceptIds: number[];
  /** Variante de transferência com domínio trocado. */
  transferVariant: string;
  steps: MissionStep[];
}

/** Cenário recorrente: Loja Digital (planejamento §12). */
export const MISSIONS: Mission[] = [
  {
    slug: "charged-but-lost",
    title: "The charge went through, but the answer got lost",
    problem:
      "Digital Store: checkout calls the payment processor, the response is lost after the charge. What does the customer see — and what would you do?",
    product:
      "Annotated timeline, retry policy and the justified invariant that repeating the same operation never bills twice.",
    prereqConceptIds: [11, 12, 13, 14],
    transferVariant:
      "Apply the same reasoning to creating a document or order — the statement never mentions payment.",
    steps: [
      {
        id: "cbl-briefing",
        kind: "briefing",
        title: "The answer never arrived",
        body: "Digital Store: at checkout the app calls the payment processor. The customer's card may have been billed, but the app's wait ended before any response came back. The screen shows an error. Before reading any theory, write down two things: what the customer believes happened, and what you would do next as the store. Keep your answer; you will compare it with the evidence at the end.",
        needsEvidence:
          "A written first hypothesis covering what the customer sees and the action you would take.",
      },
      {
        id: "cbl-predict",
        kind: "predict",
        title: "Predict before you look",
        body: "Commit to a prediction about the timeout scenario before any experiment shows what happens. Consider who stopped waiting, who kept working, and what each side can know at that moment. You cannot change the answer after submitting it.",
        taskId: "t-11-predict",
        needsEvidence: "The prediction submitted, with the help level recorded.",
      },
      {
        id: "cbl-experiment",
        kind: "experiment",
        title: "Run the same operation twice",
        body: "Open the bench and trigger a failing dependency, then repeat the same customer action several times. Trace each attempt on a timeline: what the caller saw, what the processor may have done. Then redo the trace once with every repeat carrying the same operation identifier and once with a fresh identifier each time. Count how many times the customer could be billed in each trace.",
        labId: "circuit",
        needsEvidence:
          "A timeline of at least three attempts with the number of possible billings in each of the two traces.",
      },
      {
        id: "cbl-decide",
        kind: "decide",
        title: "Choose a repeat policy",
        body: "Pick the policy for repeating the checkout call. Your justification must protect this invariant: one purchase never produces an additional charge. More than one policy can satisfy it; the feedback explains what each one gives up.",
        taskId: "t-14-compare",
        needsEvidence:
          "A decision plus a sentence stating which invariant it preserves and why.",
      },
      {
        id: "cbl-transfer",
        kind: "transfer",
        title: "Same reasoning, new domain",
        body: "A collaborative editor lets users create a new document. The request times out, the user presses the button again. Apply what you concluded earlier to this situation without any hint about which mechanism matters. The nouns have changed; the question is whether your decision survives.",
        taskId: "t-14-variant",
        needsEvidence: "The variant answered independently, with the help level recorded.",
      },
      {
        id: "cbl-dossier",
        kind: "dossier",
        title: "Write the dossier",
        body: "Write the dossier: an annotated timeline of the lost response, the repeat policy you chose, and the invariant it preserves, plus one thing you got wrong or changed your mind about. Saving it records the mission. Because the transfer task was completed, a review of that variant is scheduled automatically about 72 hours later; answering it then shows whether the reasoning was retained.",
        needsEvidence:
          "Dossier text covering timeline, chosen policy, invariant and one change of mind.",
      },
    ],
  },
  {
    slug: "slow-catalog",
    title: "The catalog got slow — and sometimes shows stale data",
    problem:
      "Digital Store: the catalog page is slow and occasionally stale. The first hypothesis may be incomplete; the evidence separates slowness from staleness.",
    product:
      "Before/after comparison, a data-access decision and an update strategy proportional to the case.",
    prereqConceptIds: [27, 25, 26, 2, 91, 93],
    transferVariant:
      "A feed or directory with a different update pattern — the reasoning must survive the domain change.",
    steps: [
      {
        id: "sc-briefing",
        kind: "briefing",
        title: "Slow, and sometimes wrong",
        body: "Digital Store: the catalog page takes seconds to load, and a few customers report seeing an old price or a product that was already removed. Write your first hypothesis for the cause. It will be collected as is, not graded. Then say which complaint, slow or outdated, your hypothesis would fix, and whether it could fix both.",
        needsEvidence:
          "A written first hypothesis and which complaint(s) it would address.",
      },
      {
        id: "sc-experiment-access",
        kind: "experiment",
        title: "Compare how data is fetched",
        body: "In the bench, run the same page with one query per item, one batched query, and one JOIN. Vary the list size, the number of related rows per item and the round-trip cost. Record round trips and rows returned for each. The numbers are a didactic model, not a benchmark. Note what this evidence says about slowness and what it cannot say about outdated data.",
        labId: "nplusone",
        needsEvidence:
          "A table of three strategies with round trips and rows, and one sentence separating slowness from outdated data.",
      },
      {
        id: "sc-decide",
        kind: "decide",
        title: "Decide access and update",
        body: "Choose both how the page reads its data and how it keeps what it shows up to date. Treat the two as separate decisions and size them to this case. Several combinations are defensible; the feedback names what each one costs.",
        taskId: "t-27-compare",
        needsEvidence:
          "A decision for access and one for updates, each with a stated cost.",
      },
      {
        id: "sc-experiment-measure",
        kind: "experiment",
        title: "Which number answers the complaint?",
        body: "In the latency bench, compare the average with the highest percentiles for the same sample. Decide whether the improvement you expect would show up in the average, in the tail, or in both, and which measure answers the customer who says the page is sometimes slow. State the sample size limits of your conclusion.",
        labId: "tail",
        needsEvidence:
          "The chosen measure with a reason tied to the complaint and one stated limit of the sample.",
      },
      {
        id: "sc-transfer",
        kind: "transfer",
        title: "A different list",
        body: "A social feed shows posts with their authors. Posts arrive constantly, while author profiles rarely change. It also feels slow and occasionally shows outdated information. Decide what to do. The pattern of change differs from the page you studied, so a copied answer may not hold.",
        taskId: "t-27-variant",
        needsEvidence: "The variant answered independently, with the help level recorded.",
      },
      {
        id: "sc-dossier",
        kind: "dossier",
        title: "Write the before/after dossier",
        body: "Write the dossier: a before and after comparison, your data-access decision, your update strategy, and the measure you chose with its justification. Say whether your first hypothesis was incomplete and how. Saving records the mission, and a review of the transfer variant is scheduled automatically about 72 hours later.",
        needsEvidence:
          "Dossier text covering comparison, access decision, update strategy, chosen measure and the first hypothesis revisited.",
      },
    ],
  },
];

const bySlug = new Map(MISSIONS.map((m) => [m.slug, m]));

export function getMission(slug: string): Mission | undefined {
  return bySlug.get(slug);
}

/**
 * Missões ativas (com progresso registrado) como hints para recommendNext
 * (D9/D11). Apenas missões iniciadas geram recomendação — nada de empurrar
 * conteúdo não solicitado (planejamento §13).
 */
export function missionHintsFromLearning(state: LearningState): MissionHint[] {
  const hints: MissionHint[] = [];
  for (const [slug, progress] of Object.entries(state.missions)) {
    const mission = bySlug.get(slug);
    if (!mission) continue;
    hints.push({
      slug,
      title: mission.title,
      stepTitle: progress.step,
      pendingConceptIds: [...mission.prereqConceptIds],
    });
  }
  return hints;
}
