# prd-project2-s8 — o COMO da auditoria visual/a11y (F8)

## Decisões que você segue (PRD central D12/D13, planejamento §15)
- Tokens novos em `src/styles.css` (OKLCH): `--paper` (superfície de leitura
  clara p/ blocos editoriais longos), `--paper-muted`, `--accent-2` (segundo
  acento funcional p/ estado: sucesso/aviso/alerta), `--ink` (hierarquia de
  texto sobre paper). Violeta permanece marca (header, CTA primário) e perde
  dominância; estados informativos migram p/ `--accent-2` e neutros.
- Contraste AA em todo texto sobre paper e sobre o shell escuro.
- Fim do uppercase em textos explicativos (blocos de aula/explicações);
  uppercase restrito a rótulos curtos de UI (tabs, badges, h2 de seção pode
  permanecer como rótulo).
- Estados de bancada: inicial, em execução, pausado, concluído, inconclusivo,
  fora-do-modelo, sem evidência, retomada — checar existência e nome acessível.
- A11y: todo instrumento com equivalente textual (`textEquivalent`); nada
  depende de hover; estados diferenciados por texto+forma além de cor;
  `prefers-reduced-motion` preserva o raciocínio; interações essenciais por
  teclado; foco previsível; região viva discreta (sem anunciar cada log).
- Mobile por tarefa: cenário/pergunta antes da bancada; resultado sem rolar
  tudo; rolagem horizontal só em código/timeline.
- E2E: checks de texto deixam de usar `body.upper()` — comparar case-
  insensitive ou texto renderizado real.

## Como auditar
- Leia `src/styles.css` (tokens atuais), `src/components/**`, rotas listadas
  no seu planejamento. `rg -n "text-\\[|bg-\\[|#[0-9a-fA-F]{3,8}|rgb\\(|uppercase"` 
  para caçar cores hardcoded e uppercase.
- Verifique instrumentos em `src/components/instruments/*` (eixos, legendas,
  `textEquivalent`) e bancadas em `src/components/sandboxes/*`.

## Aceite do relatório
1. Bloco de tokens colável (@theme, nomes + valores OKLCH + pares de
   contraste AA declarados).
2. Tabela de mudanças: arquivo → local → de → para (cada linha aplicável por
   um editor sem contexto extra). Marque as que exigem decisão de design.
3. Lista de checks E2E novos (fluxos 1–8) sem `body.upper()`.
4. Gaps de a11y/mobile priorizados (P0 bloqueia aceite; P1 pode ficar p/ F9).

## Registro de decisões do subagente
- (vazio — preencha numerado no relatório)

## Proibições
- NÃO edite arquivos (read-only, PRD D15). NÃO proponha troca de marca/fontes
  além do §15.1 (evolução, não reposição). NÃO use `oc`. NÃO pergunte ao
  usuário.
