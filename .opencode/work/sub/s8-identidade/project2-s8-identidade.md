# project2-s8 — Identidade v2 e a11y (F8)

## Missão
Auditar (read-only) a identidade visual e a acessibilidade do app contra os
princípios §15 do planejamento e as decisões D12/D13, e entregar um plano de
mudança aplicável: tokens novos (paper/accent-2/ink), lista concreta de
substituições de cor hardcoded, pontos de uppercase em explicações a remover,
gaps de a11y (equivalentes textuais, teclado, reduced-motion, mobile por
tarefa) e a lista de checks E2E atualizada.

## Escopo
- Seu: auditoria e plano de `src/styles.css`, `src/routes/__root.tsx` (fontes),
  `src/components/**`, `src/routes/labs.$id.tsx`, `src/routes/sandboxes.tsx`,
  `src/routes/concepts.$id.tsx` (blocos legados), `src/routes/index.tsx`,
  `src/routes/progress.tsx`, `src/routes/readiness.tsx`, `src/components/lesson/*`.
- Fora do seu escopo: conteúdo pedagógico, lógica, `src/lib/*`, rotas de
  missões (F7 em paralelo), testes unitários (exceto listar os que precisam
  mudar).

## Por quê
Cores devem representar estado/informação; violeta volta a papel de marca;
contraste AA e equivalentes textuais são pré-requisitos de um instrumento de
estudo — não cosmética.

## Fronteiras
- Recebe: D12/D13 (PRD), §15 (planejamento), estado atual do código.
- Entrega: relatório com (1) bloco de tokens pronto para colar em styles.css;
  (2) tabela arquivo → mudança (seletor/linha, de→para); (3) lista de checks
  E2E novos (texto sem body.upper()); (4) riscos/conflitos com F7.

## Dono exclusivo de
Nada no disco — subagente read-only (PRD D15). Escreve só no relatório.
