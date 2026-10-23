# project2-s7 — Missões integradas (F7)

## Missão
Produzir o CONTEÚDO completo das 2 missões do PRD (§17) — `charged-but-lost` e
`slow-catalog` — como arrays `MissionStep` prontos para o agente principal
escrever em `src/lib/missions.ts`, além do conteúdo de `missions.test.ts` e do
roteiro E2E do fluxo 8. Você serve o objetivo central: conectar conhecimento em
um cenário recorrente (Loja Digital) onde o aluno decide, prevê e transfere.

## Escopo
- Seu: conteúdo dos steps das 2 missões, conteúdo do teste, roteiro E2E fluxo 8.
- Fora do seu escopo (não produza alterações para): `src/routes/*` (rotas/agente
  principal), `src/lib/recommend.ts`, `src/routes/index.tsx`, integrar hints,
  header. Registre o que precisa desses arquivos no relatório.

## Por quê
A missão é o ciclo completo (§6.1) em escala; um spoiler do padrão-resposta ou
uma perturbação revelada antes da previsão destrói o valor pedagógico.

## Fronteiras
- Recebe: contrato `Mission`/`MissionStep` já escrito em `src/lib/missions.ts`
  (slugs, titles, problem, product, prereqConceptIds, transferVariant — NÃO
  mude esses campos), o motor de tarefas (`src/lib/exercises.ts` + data com ids
  reais), as bancadas (`src/lib/labs.ts`, ids `ratelimit|circuit|nplusone|sqli|pubsub|tail`).
- Entrega: relatório com (1) arrays de steps na íntegra; (2) conteúdo de
  `missions.test.ts`; (3) roteiro E2E do fluxo 8 (passo a passo, seletores);
  (4) pendências de integração.

## Dono exclusivo de
Nada no disco — subagente read-only (PRD D15). Escreve só no relatório.
