# Stage F9 — status da rodada de remix (verificação e fechamento)

Projeto: VibeCoder Academy — Project 2 (ambiente de aprendizagem aplicada).

## O que foi feito nesta rodada

Remix ativado ("I've successfully remixed this project..."). Os 3 pilares da
numeração vigente (project2.md, prd-project2.md, roadmap-proj2) existem,
completos e coerentes — início direto na primeira fase não concluída (F9,
parcial desde a rodada anterior).

### Roteiro E2E integral do PRD §10 (o que faltava)

Roteiro escrito do zero (`e2e/e2e_f9.py`, preservado no projeto; cópia
executável em /tmp/browser/vibecoder/). **46/46 checks OK, console limpo
(0 erros)**, uma sessão contínua cobrindo os 8 fluxos:

1. **F1 — Home de retorno:** "Pick up where you stopped", aula em andamento
   (#1), missão em andamento; o card de retorno leva ao ponto exato
   (`/concepts/1`).
2. **F2 — Aula v2:** lição âncora #1 com caminho aprofundado completo
   (Objective/Mental model/Scenario/Practice/Worked decision/Transfer);
   resposta errada → feedback nomeia a causa ("per-batch allowance") e lista
   o critério quebrado; resposta correta → "Atendido".
3. **F3 — Bancada focada:** `/labs/ratelimit` com as 6 seções; execução por
   passos mostra 200 → 429; troca de configuração no bench (pubsub, flaky
   worker) preserva a tentativa anterior (profundidade da fila mantida).
4. **F4 — Compat:** `/sandboxes?s=pubsub` redireciona para `/labs/pubsub`.
5. **F5 — S4 semântico:** `' OR '1'='1` → vulnerável com explicação de
   precedência ("AND binds before OR"); `admin' --` → estado "fora do
   modelo"; parametrizada com username real casa literal e retorna a linha.
6. **F6 — S6:** exemplo 99×100/1×10.000 no texto (P99 = 100 ms, máx =
   10.000 ms, média 199 ms); bancada dispara 100 requests e desenha
   p50/p99/max.
7. **F7 — Progresso honesto:** 6 dimensões com rótulos e denominadores
   "N of M"; sem percentual global; aplicação declarada em "My app"
   (registro em /readiness aparece em Declared), "never counted as mastery".
8. **F8 — Missão:** ciclo completo de `charged-but-lost` (briefing → predict
   → experiment → decide → transfer → dossier); transfer sem spoiler do
   domínio original (verificado dentro do step); dossiê salvo e persiste
   após reload; índice mostra "dossier saved".

Correções do roteiro durante a rodada (armadilha conhecida do F8 respeitada:
labels com CSS `uppercase` aparecem transformados em `innerText`; valor de
`textarea` não sai em `innerText` — lido pela propriedade).

### Gates

- tsgo --noEmit: limpo.
- vitest: **101/101** (11 arquivos, ≥ 60 ✓).
- E2E integral: **46/46** checks, 0 erros de console (screenshot em
  /tmp/browser/vibecoder/screenshots/: f1..f8).

## Aceite global — planejamento §9 (replanejamento das telas)

- §9.1 Home ponto de trabalho ✓ (F6 + fluxo 1 do E2E: retorno ao ponto
  exato, revisão pertinente, objetivo).
- §9.2 Busca por sintoma/sinônimo com motivo da correspondência ✓ (F6 +
  teste de rota; estado vazio com rotas de saída verificado na rodada F6).
- §9.6 Bancada: cenário/controles/representação/evidência/interpretação
  separados ✓; trocar configuração não apaga tentativas ✓ (fluxo 3).
- §9.7 Feedback diagnóstico com causa e próxima ação ✓ (fluxo 2 e 8; motor
  testado — "Nenhum critério…", causas obrigatórias).
- §9.8 Progresso com denominadores rotulados e evidências ✓ (fluxo 7);
  aplicação em registro separado com "não se aplica" ✓ (/readiness).
- §9.3/§9.9 (percurso e caderno de decisões) cobertos parcialmente: percurso
  vive nas missões (dossiê = caderno da missão); um índice de percurso
  dedicado não faz parte do escopo fechado do roadmap-proj2.

## Validação final (PRD §14 / planejamento §18 — respostas honestas)

- Objetivo entendível sem avaliador, previsão antes de ver, distinguir modelo
  sintético de medição real, alternativa válida com trade-off, variante com
  nomes trocados, feedback que corrige o equívoco: **suportados por
  estrutura e cobertos por testes/E2E** (rubricas com causa, validAlternatives,
  transfer, "Teaching model, not a benchmark"). Validação **com alunos reais
  ainda não foi feita** — é observação pós-publicação, não gate de código.
- Retomar atividade e encontrar lacuna ✓ (fluxo 1 + /progress com
  recommendNext e motivo).
- Recuperação após intervalo ✓ agendada automaticamente (+72h, testada);
  **calibração do intervalo é trabalho do próximo remix**.
- Percursos para iniciantes/experientes sem fricção: portas por problema +
  biblioteca + orçamento de tempo; não validado com usuários.
- Mobile e a11y: auditoria F8 (equivalentes textuais, teclado,
  reduced-motion, tokens AA); E2E desta rodada roda em desktop 1280px —
  screenshots mobile da F8 em /tmp (não sobrevivem ao wipe).

## Bloqueio externo: monitor OpenCode (permanece)

Runtime OpenCode indisponível nesta rodada: binário removido pelo wipe do
ambiente (`opencode: No such file or directory`) e proxy `/oc` do app
responde 502. Mesmo bloqueio já registrado em stage-07/08-status.md
(UnknownError, refs err_cc839d3f/err_fa677f19/err_52eaceb9). O relatório
desta rodada está pronto neste arquivo para avaliação quando o runtime
voltar.

## Status: F9 COMPLETA — roadmap-proj2 fechado nesta rodada
## Mensagem protocolada: "remix finalizado (+1)"
## Próximo remix: lições das categorias restantes, instrumentos
event-track/query-explainer/table, missões 12.3–12.5, calibração de retenção.
