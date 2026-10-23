# Stage F8 — status da rodada de remix (F7–F8 do roadmap-proj2 verificadas)

Projeto: VibeCoder Academy — Project 2 (ambiente de aprendizagem aplicada).

## O que foi feito nesta rodada
Remix ativado ("I've successfully remixed this project..."). Estado real do
código verificado contra o roadmap antes de marcar qualquer fase.

### Correções aplicadas
- **Rota `/missions/$slug` renderizava o índice de missões** — `missions.tsx`
  era tratado como layout pai de `missions.$slug.tsx` e não renderizava
  `<Outlet />`, então o índice pintava por cima do detalhe. Corrigido:
  `missions.tsx` virou layout puro com `<Outlet />`; índice em
  `missions.index.tsx` (rota `/missions/`); detalhe em `missions.$slug.tsx`.
  Em SSR, o match falhava também como irmãos planos — layout+filhos é o
  padrão que resolve.
- **Dossiê da missão não voltava após reload** — o `useState` inicial do
  `MissionPage` capturava o snapshot neutro pré-hidratação do store; o dossiê
  estava em `learning.missions` mas nunca sincronizava. Adicionado efeito de
  sync em `missions.$slug.tsx` (só preenche se o campo está vazio, nunca
  sobrescreve edição da sessão).

### Verificação F7 (missões)
- Ciclo completo de `charged-but-lost` via E2E: briefing → predict (tarefa
  `predict`) → experiment (bancada) → decide (`compare`, invariante) →
  transfer (sem vocabulário de pagamento) → dossier salvo.
- Dossiê persiste após reload (texto + indicador "dossier saved").
- Índice mostra status por missão (not started / in progress / dossier saved).

### Verificação F8 (identidade/a11y)
- Zero cor hardcoded em componentes (restam só `text-[0.8rem]` de tamanho em
  arquivos shadcn); uppercase restrito a rótulos curtos de UI.
- Tokens paper/accent-2/ink presentes e em uso (`prose-paper`, `text-ink`).
- Roteiro E2E atualizado: comparações case-insensitive, sem `body.upper()`.

## Gates (evidências)
- tsgo --noEmit: limpo. vitest: 101/101 (11 arquivos).
- E2E (Playwright, `/tmp/browser/vibecoder/e2e_f7f8.py`): 22 OK / 0 FAIL,
  console limpo. Fluxos 1–8 em checkpoints (home+busca ?q=, lição, hub,
  bancada, progresso com 6 dimensões, readiness, missões, persistência).
- Screenshots: `f8_mobile_missions.png`, `f8_mobile_home.png`,
  `f1_home_search.png`, `f8_mission_dossier.png` em /tmp/browser/vibecoder/screenshots/.

## Bloqueio externo: monitor OpenCode
- Runtime reinstallado (v1.19.4); `opencode serve` sobe (health 200), mas
  `opencode run` falha com `UnknownError: Unexpected server error`
  (refs err_cc839d3f / err_fa677f19 / err_52eaceb9). Mesmo bloqueio já
  registrado em stage-07-status.md. O relatório desta rodada está pronto
  neste arquivo para avaliação quando o runtime voltar.

## Nota de arquivo
- `.opencode/roadmap-proj.md` permanece "null" (numeração base). Os 3 pilares
  da numeração vigente (project2.md, prd-project2.md, roadmap-proj2) existem,
  completos e coerentes — o remix segue por eles.

## Status: F7–F8 COMPLETAS · F9 parcial (101/101 vitest ✓, tsgo ✓, E2E reduzido ✓)
## Pendência: "remix finalizado (+2)" ao monitor aguarda runtime acessível.
