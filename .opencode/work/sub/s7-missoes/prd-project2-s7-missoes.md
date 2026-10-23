# prd-project2-s7 — o COMO das missões (F7)

## Decisões que você segue (PRD central)
- D10: rotas `/missions` e `/missions/$slug` são do agente principal; você
  produz apenas dados e testes. Estrutura `MissionStep` e `Mission` está fixa
  em `src/lib/missions.ts` — leia-a antes de redigir.
- PRD §17.1 (charged-but-lost): 6 steps — briefing; predict (tarefa sobre
  timeout); experiment (bancada, repetir operação com/sem idempotência);
  decide (tarefa `compare` com invariante "uma compra não gera cobrança
  adicional"); transfer (tarefa `variant` sem a palavra pagamento); dossier.
- PRD §17.2 (slow-catalog): 6 steps — briefing; experiment (S3: por-item/lote/
  JOIN, separar lentidão de desatualização); decide (tarefa `compare`:
  acesso + atualização, alternativas válidas); experiment (S6: média vs P99);
  transfer (tarefa `variant`: feed com padrão de atualização diferente);
  dossier.
- Regra comum: perturbação só revelada APÓS a previsão; nenhum passo informa
  o padrão-resposta; dossiê salvo em `learning.missions[slug]`; cada missão
  fecha com item de revisão agendado (72h) — mencione esse passo no corpo do
  dossier (o agendamento em si é automático via store, D15).

## Contratos que consome
- `taskId` deve existir no registro real: leia `src/lib/exercises-data/*.ts`
  e use ids existentes. Se uma etapa exigir tarefa inexistente, NÃO invente id:
  redija a tarefa completa (formato `Task` de `src/lib/exercises.ts`, id no
  padrão `t-<conceptId>-<tipo>`) como proposta no relatório, marcada como nova.
- `labId` só os 6 ids válidos. `needsEvidence` é critério textual, nunca
  "screenshot".

## Escopo por fase do pacote (aceite)
1. Steps da missão 1: 6 steps, kinds corretos, body ≤ 120 palavras/step, sem
   spoiler, `taskId`/`labId` válidos. Aceite: checklist por step.
2. Steps da missão 2: idem, com as duas bancadas (S3 e S6) e o separador
   lentidão × desatualização.
3. Conteúdo de `missions.test.ts`: etapas das 2 missões; transfer com domínio
   trocado; nenhum spoiler do padrão (ex.: asserção de que nenhum body contém
   "idempotency-key" antes do step decide); ids referenciados existem.
4. Roteiro E2E fluxo 8: missão `charged-but-lost` completa uma volta do ciclo
   e salva dossiê; dossiê persiste após reload (seletores estáveis).

## Tools e skills recomendadas
- Leitura de código: view/rg do ambiente (read-only). Nada de oc/monitor.

## Registro de decisões do subagente
- (vazio — preencha numerado no relatório)

## Proibições
- NÃO edite nenhum arquivo (read-only, PRD D15). NÃO mude slugs/títulos/
  prereqs fixados. NÃO use `oc`. NÃO pergunte ao usuário: decida e registre.
