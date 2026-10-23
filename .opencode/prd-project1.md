# PRD — VibeCoder Academy · 111 Production Essentials (project1)

> PRD derivado do planejamento `project1.md`. O planejamento é a fonte de verdade
> do escopo (o QUÊ e o POR QUÊ); este PRD registra o COMO: decisões técnicas,
> escopo por fase e critérios de aceite. O roadmap `roadmap-proj1` organiza as
> fases em ordem de dependência.

---

## 1. Visão do produto

Um site educativo completo, fluido e intuitivo que ensina os **111 conceitos
essenciais de arquitetura de produção** extraídos do reel de @nataindata
("Who's gonna tell vibe coders about..."), com:

- **Explicação ELI10** para cada conceito ("como se você explicasse para uma
  criança de 10 anos").
- **Caso real de produção**: por que o conceito quebra apps escritos em "vibe
  coding" quando escalam (risco) e como arquitetar corretamente (fix).
- **Exemplos interativos**: 6 sandboxes com simulações ao vivo (rate limiter,
  circuit breaker, N+1 queries, SQL injection, pub/sub + filas, distribuição de
  latência P99/tail).
- **Auditoria "Production Readiness"**: o usuário marca os conceitos que já
  implementou no próprio app e acompanha um score ao vivo.

### Problema que resolve
Apps escritos com IA funcionam localmente com uma pessoa, mas quebram quando
escalam para milhares de usuários, dinheiro real, latência de rede e atores
maliciosos. O site fecha essa lacuna de conhecimento de forma lúdica, prática e
verificável.

### Público e tom
Desenvolvedores "vibe coders" e curiosos de infraestrutura. Tom direto,
concreto, com analogias simples e exemplos de código. Interface em inglês
(conteúdo fonte do reel é em inglês — decisão D4).

---

## 2. Fontes de verdade

| Fonte | Uso |
|---|---|
| `project1.md` (Parte 1) | Transcrição oficial dos 111 conceitos (nomes e ordem) |
| `project1.md` (Parte 2) | Texto ELI10 de cada conceito (seções temáticas) |
| `project1.md` (Parte 3) | Dados `itemsData` (eli / risk / fix por item) + referência de UX do app original (single-file HTML) |
| Este PRD | Decisões técnicas, escopo por fase e aceite |

Regra de integridade: **os 111 conceitos devem ser os mesmos, com os mesmos
números e nomes da Parte 1**, na mesma ordem. Os campos `eli`, `risk` e `fix`
vêm de `itemsData` (Parte 3); quando `itemsData` divergir da Parte 2, prevalece
`itemsData` (mais completo: traz risco e fix).

---

## 3. Stack e decisões técnicas

| # | Decisão | Justificativa |
|---|---|---|
| D1 | TanStack Start (arquitetura existente do template): rotas em `src/routes/`, componentes em `src/components/`, dados em `src/lib/` | Fixo pela plataforma; roteamento por arquivos; nunca `react-router-dom` |
| D2 | **Sem backend**: conteúdo é estático (dados em TypeScript), sem Lovable Cloud/Supabase | O produto é educacional e stateless por usuário; o único estado é o checklist pessoal — localStorage basta; evita custo/complexidade de banco sem necessidade |
| D3 | Checklist de Readiness persistido em `localStorage` (`vibecoder.readiness.v1`), lido só em `useEffect` (SSR-safe) | Regra da plataforma: storage de browser visível em render inicial causa hydration mismatch; não há login, então estado local é suficiente |
| D4 | Conteúdo e UI em inglês | O material fonte (reel, ELI10, risk/fix) é em inglês; traduzir 111 × 3 textos introduz risco de perda de fidelidade sem ganho de escopo |
| D5 | Dados extraídos de `project1.md` por **script determinístico** (parser do bloco `itemsData`), nunca digitados à mão | Elimina erro humano em 111 × 3 campos; o resultado passa por gate automático de integridade |
| D6 | Detalhe do conceito em **rota dedicada** `/concepts/$id` (não modal), com navegação prev/next | TanStack Start é file-based routing: rota dedicada é idiomática, compartilhável por URL e evita estado frágil de modal sobre grid |
| D7 | Sandboxes em rotas próprias: `/sandboxes` (hub) e âncoras/blocos por simulação; cada sandbox é um componente isolado em `src/components/sandboxes/` | Isolamento de estado por simulação; hub centraliza os 6; deep-link a partir do card do conceito relacionado |
| D8 | Lógica dos simuladores extraída para funções puras em `src/lib/simulators.ts` (token bucket, máquina de estados do breaker, gerador de distribuição de latência, resolver de N+1 simulado) e cobertas por testes Vitest | Testável sem browser; a UI apenas renderiza o estado retornado |
| D9 | Design "Mission Control" escuro com tokens semânticos em `src/styles.css` (`@theme`), fontes Space Grotesk (display) + JetBrains Mono (código), já pré-carregadas no `__root` | Direção visual distinta e coerente com o tema (infraestrutura/produção); nada de cor hardcoded em componentes |
| D10 | Ícones `lucide-react`; componentes `shadcn/ui` existentes (badge, card, input, button, progress, dialog) onde couberem | Já instalados; consistência |
| D11 | Subagentes (`spawn_agent`) atuam como **QA/investigação read-only** (revisão de dados extraídos, revisão de UX, checagem de acessibilidade); a escrita de código fica com o agente principal | Nesta plataforma `spawn_agent` é read-only — não edita arquivos; plan.md exige enxame, aqui ele opera no papel de revisão e verificação (justificativa registrada) |
| D12 | Sem `useEffect` fetching, sem `useQuery` para dados estáticos: import direto do módulo de dados | Os dados são estáticos; loaders desnecessários |

### Regras da plataforma respeitadas
- Nada de `src/pages/`, `App.tsx`, `entry-client/server.tsx`; `__root.tsx` mantém `<Outlet />`.
- `routeTree.gen.ts` nunca editado à mão.
- Cada rota de conteúdo tem `head()` próprio com título/descrição/OG únicos; `__root` não conta para a index.
- CSS: `@import` apenas no topo de `src/styles.css`; fontes via `<link>` no `__root`.
- Sem cor hardcoded (`bg-[#...]`, `text-white`) em componentes — só tokens semânticos.
- `localStorage` lido em `useEffect` (nunca em initializer de `useState`).

---

## 4. Modelo de dados

```ts
// src/lib/concepts.ts
export type Category =
  | "Traffic" | "DevOps" | "Resilience" | "Async" | "Streaming"
  | "Database" | "Distributed" | "Performance" | "Scaling"
  | "Security" | "Infra"; // categoria final extraída da fonte p/ itens 81–111

export interface Concept {
  id: number;      // 1..111
  name: string;    // nome canônico (Parte 1)
  cat: Category;   // categoria do itemsData
  eli: string;     // explicação ELI10
  risk: string;    // por que vibe coders quebram isso em produção
  fix: string;     // solução de arquitetura de produção
}

export const CONCEPTS: Concept[];       // 111 itens, ordem 1..111
export const CATEGORIES: Category[];    // derivadas, ordem estável
export function getConcept(id: number): Concept | undefined;
```

O script de extração (Fase F1) lê `project1.md`, isola o bloco `itemsData`,
normaliza aspas/template literals e emite `src/lib/concepts.ts` formatado.
Se o parse falhar, fallback registrado: extração linha-a-linha por regex
`{ id: N, name: ..., cat: ..., eli: ..., risk: ..., fix: ... }` com validação
contínua. O gate da F1 **é** a prova de integridade (seção 10).

---

## 5. Arquitetura de arquivos

```
src/
  lib/
    concepts.ts          # F1: dados dos 111 conceitos + categorias (contrato)
    simulators.ts        # F6: lógica pura dos 6 simuladores
    readiness.ts         # F5: helpers do checklist (localStorage, score)
  components/
    site-header.tsx      # F2: header com logo + readiness compacto
    concept-card.tsx     # F3: card do grid
    concept-detail.tsx   # F4: conteúdo da página de detalhe
    sandbox-card.tsx     # F6: card de sandbox no hub
    sandboxes/
      rate-limiter.tsx   # F6
      circuit-breaker.tsx# F6
      n-plus-one.tsx     # F6
      sql-injection.tsx  # F6
      pubsub-queue.tsx   # F6
      tail-latency.tsx   # F6
  routes/
    index.tsx            # F3: home (hero, busca, filtros, grid, destaque sandboxes)
    concepts.$id.tsx     # F4: detalhe do conceito
    sandboxes.tsx        # F6: hub dos simuladores
    readiness.tsx        # F5: auditoria completa (lista + filtros + score)
    __root.tsx           # F2: título/meta raiz + shell
  test/
    concepts.test.ts     # F1: integridade dos dados
    simulators.test.ts   # F6: lógica dos simuladores
    readiness.test.ts    # F5: persistência/score
```

Propriedade de arquivos é exclusiva por fase; nenhuma fase edita o arquivo de
outra (evita conflito no enxame).

---

## 6. Escopo por fase e critérios de aceite

### F0 — Contratos e fundamentos
Escopo: definir tipos/categorias (seção 4), confirmar no código o que o
planejamento afirma (stack limpa, componentes disponíveis, rota `/` livre).
Aceite: tipos compilando; decisões D1–D12 registradas.

### F1 — Dados dos 111 conceitos (contrato central)
Escopo: script de extração de `project1.md` → `src/lib/concepts.ts`; teste
`concepts.test.ts`; revisão por subagente QA comparando amostra contra a fonte.
Aceite (gate G1):
- [ ] 111 itens, ids 1..111, sem duplicatas, ordem correta
- [ ] Nomes idênticos à Parte 1 da fonte (comparação programática)
- [ ] Todos os campos `eli/risk/fix` não vazios e ≥ 20 caracteres
- [ ] Todas as `cat` ∈ categorias válidas; contagem por categoria ≥ 1
- [ ] Teste passa (`vitest`)

### F2 — Design system e shell
Escopo: tokens escuros "Mission Control" em `src/styles.css` (bg/foreground/
primary/success/warning/danger/info, bordas, mono); `__root.tsx` com título/meta
raiz e fontes (Space Grotesk + JetBrains Mono via `<link>`); `site-header.tsx`
com badge de readiness compacto (percentual + barra).
Aceite (gate G2): build limpo; tema aplica-se a toda a árvore; sem cor
hardcoded; header renderiza em todas as rotas.

### F3 — Home (`/`)
Escopo: hero ("What vibe coding doesn't teach you until production crashes"),
busca por texto (nome/eli/número/categoria) com estado em URL (`?q=`, `?cat=`),
pills de categoria, grid de cards (3 colunas em desktop), destaque dos 6
sandboxes, rodapé. Card: número `#id`, categoria, nome, ELI10 (2 linhas), CTA
"Inspect Mitigation".
Aceite (gate G3): 111 cards renderizam; busca filtra ao digitar; pill "All" +
categorias filtram; URL compartilhável reflete filtro; vazio mostra estado
amigável.

### F4 — Detalhe do conceito (`/concepts/$id`)
Escopo: rota com validação de id (1..111, senão notFound); blocos ELI10
(indigo), "Why vibe coders break it" (rose/vermelho semântico), "Production
solution" (verde semântico); botão "Mark as Implemented"/"Implemented";
navegação prev/next; link para sandbox relacionado (mapa conceito→sandbox);
meta head() única por conceito.
Aceite (gate G4): 111 rotas resolvem; id inválido → 404; toggle reflete no
header e persiste após reload; prev/next funcionam nas extremidades (1 e 111).

### F5 — Readiness tracker
Escopo: hook `useReadiness` (localStorage, hydration-safe); score global =
marcados/111; página `/readiness` com lista completa agrupada por categoria,
filtros "All / Implemented / Pending", barra de progresso, percentual e frase
de status (ex.: "Mission ready", "Getting there").
Aceite (gate G5): toggle em qualquer lugar atualiza score global; reload
preserva; filtros corretos; teste de persistência/lógica passa.

### F6 — Sandboxes (6 simuladores)
Escopo por sandbox (specs na seção 7); lógica pura em `lib/simulators.ts` +
teste `simulators.test.ts`; componentes isolados; hub `/sandboxes` com cards e
deep-links dos conceitos relacionados.
Aceite (gate G6): cada sandbox opera conforme spec; testes da lógica passam;
nenhum estado vaza entre simulações ao reabrir.

### F7 — Polimento, SEO, verificação E2E
Escopo: `head()` por rota com og/twitter (og:image somente se houver URL
absoluta real — caso não haja, omitir); acessibilidade (foco visível, aria
labels, `prefers-reduced-motion`); responsividade (1 col mobile → 3 desktop);
Playwright: busca → detalhe → toggle → reload persiste → sandbox 429 → breaker
tripa; relatório final ao project-monitor.
Aceite (gate G7): build OK; fluxo E2E passou com evidência de screenshot;
nenhum erro no console do preview; roadmap 100% `[x]`.

---

## 7. Especificação dos sandboxes

Todos: fundo escuro, área de log mono com autoscroll, botões com estados
`active:scale`, reset individual, estado interno isolado (não global), número
e título "Interactive Sandbox #N".

### S1 — Rate Limiter (Token Bucket) — conceito #1
- Bucket: capacidade 5, refill 1 token / 1,5 s (timer visível como tokens
  amarelos cheios/vazios).
- Botão "Send HTTP GET /api/v1/data": com token → log `200 OK (remaining: N)`;
  sem → `429 TOO MANY REQUESTS` destacado.
- Lógica pura: `tokenBucket({capacity, refillMs})` → `{tryConsume(), refill(),
  tokens()}` determinística (tempo injetável).

### S2 — Circuit Breaker — conceito #10
- Estados CLOSED → OPEN → HALF-OPEN → CLOSED.
- 3 falhas consecutivas → OPEN (fail fast, log "0.1ms blocked"); após cooldown
  de 5 s → HALF-OPEN (probe); 1 sucesso → CLOSED, 1 falha → OPEN de novo.
  (Melhoria sobre a referência, que voltava direto a CLOSED — melhoria
  registrada como decisão, sem alterar o escopo.)
- Botões: Simulate Success (200), Simulate Downstream Error (500), Reset.
- Lógica pura: `circuitBreaker({threshold, cooldownMs})` com eventos.

### S3 — N+1 vs Eager Loading — conceitos #27
- "Run Naive Loop (N+1)": 25 usuários → 1 + 25 queries logadas em sequência,
  métricas 26 queries / 312 ms.
- "Run Eager JOIN": 1 query com `LEFT JOIN`, métricas 1 query / 14 ms.
- Log SQL mono colorido (vermelho p/ N+1, verde p/ JOIN).

### S4 — SQL Injection Tester — conceito #78
- Input pré-preenchido `' OR '1'='1`.
- "Unescaped Query": mostra template literal vulnerável, SQL executado com a
  injeção destacada e resultado "short-circuit do password check".
- "Parameterized Query": mostra prepared statement `$1/$2`, SQL seguro e
  resultado "0 rows, login falha com segurança".

### S5 — Pub/Sub + Queue Workers — conceitos #15, #16, #20
- Botão "Publish Event": evento entra numa fila visual; 3 workers consomem em
  ritmo próprio (animação simples, sem requestAnimationFrame pesado).
- Toggle "Flaky worker": worker com falha intermitente; após 3 tentativas o
  item vai para a DLQ (Dead Letter Queue) visível com badge.
- Contadores: enqueued / processed / dead-lettered.

### S6 — P99 & Tail Latency — conceitos #93, #94
- "Send 100 requests": latências simuladas de distribuição longa-tail
  (determinística com seed; base ~1 s, cauda p99.9 dominada por "the dog
  catching the ball" até 10 s).
- Histograma em barras + marcadores p50/p99/p99.9 e pior caso; tooltip
  explicativo do conceito.

---

## 8. UX/UI

### Direção visual — "Mission Control"
- Fundo escuro profundo (slate 950-like em OKLCH), painéis levemente elevados,
  bordas sutis, brilho de acento no foco.
- Acentos semânticos: **indigo** (primary/educação), **amber** (atenção/rate
  limit), **verde** (solução/sucesso), **vermelho/rose** (risco/erro),
  **cyan** (dados/DB). Sempre via tokens (`--success`, `--warning`,
  `--danger`, `--info`), nunca classes de cor cruas.
- Tipografia: Space Grotesk para UI/títulos, JetBrains Mono para números,
  SQL, badges `#id` e logs. Números de conceito sempre mono.
- Micro-interações: hover com borda acesa, transição 200 ms, seta desliza no
  CTA do card; respeitar `prefers-reduced-motion`.

### Fluxos principais
1. Chegada na home → hero + contagem "111 essentials" → rolar o grid ou
   buscar por termo/número (ex.: "P99", "JWT", 14).
2. Card → detalhe → ler ELI10/risco/fix → marcar como implementado → prev/next
   para estudar em sequência.
3. Hero → "Try the sandboxes" → hub → simular → voltar ao conceito relacionado.
4. Header → readiness % → página de auditoria → filtrar pendentes por
   categoria → planejar o que implementar no próprio app.

### Acessibilidade
- Contraste AA no tema escuro; foco visível; navegação por teclado nos pills e
  cards (cards são links); `aria-label` em botões icônicos; logs com
  `aria-live="polite"`.

### Responsividade
- Grid: 1 col (mobile) → 2 (md) → 3 (lg). Header compacto no mobile (score em
  badge, sem barra completa). Hero empilha.

---

## 9. SEO / metadados por rota

| Rota | title | description |
|---|---|---|
| `/` | "111 Production Essentials — VibeCoder Academy" | "Learn the 111 architecture concepts that keep vibe-coded apps alive in production — ELI10 explanations, real risks, and interactive simulations." |
| `/concepts/$id` | "#N {name} — 111 Production Essentials" | ELI10 truncado (~150 chars) |
| `/sandboxes` | "Interactive Sandboxes — VibeCoder Academy" | "Run rate limiters, circuit breakers, N+1 queries, SQL injection and tail latency simulations live in your browser." |
| `/readiness` | "Production Readiness Audit — VibeCoder Academy" | "Check off the 111 production essentials you've implemented and track your readiness score." |

`og:type=website` e `twitter:card` em todas; og:image omitido (não há imagem
absoluta hospedada — regra da plataforma).

---

## 10. Testes e verificação

- **Unit (Vitest, já configurado no template):**
  - `concepts.test.ts`: integridade G1 (contagem, ids únicos, nomes = Parte 1,
    campos não vazios, categorias válidas).
  - `simulators.test.ts`: token bucket (consume/refill/429), breaker (trip,
    half-open, reset), distribuição de latência (percentis p50/p99 dentro de
    faixas), resolver N+1 (contagem de queries 26 vs 1).
  - `readiness.test.ts`: toggle/persistência/percentual (localStorage
    mockado).
- **E2E (Playwright via shell):** roteiro completo da F7 com screenshots em
  `/tmp/browser/`.
- **Observabilidade:** `/tmp/observability/build-errors.log` sem erros após
  cada fase; console do preview limpo.

---

## 11. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Parse do `itemsData` falhar (aspas/template literals) | Fallback regex linha-a-linha + gate G1 que reprova qualquer item incompleto |
| Divergência fonte vs dados extraídos | Subagente QA compara amostra aleatória de 15 itens contra o texto da Parte 2 |
| Hydration mismatch no readiness (localStorage) | Leitura somente em `useEffect`; placeholder estático no SSR |
| Estado de sandbox vazar entre visitas | Estado local por componente, remontagem via `key` |
| Grid de 111 cards pesado | Render é leve (sem imagens); busca já limita DOM; sem virtualização no MVP |
| Escopo estourar o remix | Roadmap mantém estado exato ("Próximo remix: …") para retomada sem redescoberta |

---

## 12. Log de decisões

- D2/D3: sem backend; localStorage para o checklist — escopo educacional não
  exige contas; economiza uma dependência inteira (Cloud) sem perda funcional.
- D4: inglês — fidelidade ao material fonte.
- D6: rota em vez de modal — idiomático no TanStack Start e compartilhável.
- D7/S2: breaker ganha estado HALF-OPEN (a referência simplificava) — melhoria
  pedagógica sem custo.
- D11: enxame read-only — constraint real da plataforma; revisões por
  subagente substituem a "onda de escrita" do protocolo.
- `roadmap-proj.md` (sem número) é template residual; o roadmap vigente é
  `roadmap-proj1`.

## 13. Critérios de aceite globais

- [ ] Os 111 conceitos presentes, corretos e navegáveis.
- [ ] Busca, filtros e detalhes fluidos (sem flash, sem layout shift grosso).
- [ ] 6 sandboxes funcionais e independentes.
- [ ] Readiness score persiste entre recargas e atualiza em tempo real.
- [ ] Metadados por rota únicos e corretos.
- [ ] Build limpo, testes passando, E2E verificado com evidência.
- [ ] Tema coerente, sem cores hardcoded, responsivo.

---

## 14. Mapa conceito → sandbox

Deep-links entre a teoria e a prática. O detalhe do conceito mostra o card da
sandbox relacionada ("See it in action") e o hub de sandboxes lista de volta os
conceitos que ela demonstra.

| Sandbox | Conceitos primários | Conceitos secundários citados na UI |
|---|---|---|
| S1 Rate Limiter | #1 Rate Limiting | #13 Exponential Backoff (dica de retry no 429) |
| S2 Circuit Breaker | #10 Circuit Breakers | #11 Timeouts, #12 Retries |
| S3 N+1 vs Eager | #27 N+1 Queries | #25 Indexing, #26 Query Optimization |
| S4 SQL Injection | #78 SQL Injection | #79 XSS (nota comparativa), #74 WAF |
| S5 Pub/Sub + Queue | #16 Pub/Sub, #15 Message Queues | #20 Dead Letter Queues, #17 Event-Driven |
| S6 P99 / Tail Latency | #93 P99, #94 Tail Latency | #91 Latency, #92 Throughput |

Implementação: `SANDBOX_LINKS: Record<number, SandboxId>` em
`src/lib/simulators.ts`; a página de detalhe consulta o mapa; conceitos sem
vínculo não exibem o card (nada de link morto).

---

## 15. Copy deck (textos fixos da interface)

Fonte de verdade de toda a UI em inglês; nada de texto inventado solto nos
componentes — alterar aqui é alterar no app.

- **Badge hero**: "Bridging the gap between 'it works on localhost' and 1,000,000 users"
- **H1**: "What vibe coding doesn't teach you until production crashes."
- **Sub**: "AI writes code fast, but distributed systems require real architecture. Browse all 111 concepts, learn them with 10-year-old analogies, inspect production mitigation patterns, and test live interactive simulations."
- **Placeholder de busca**: "Search by keyword, concept or number (e.g. 'P99', 'JWT', 'N+1')..."
- **Contador de resultados**: "Showing {n} of 111 items"
- **Estado vazio da busca**: "No architecture concepts match your search."
- **CTA do card**: "Inspect Mitigation"
- **Toggle de conceito**: "Mark as Implemented" / "Implemented in My App"
- **Blocos do detalhe**: "Like You're 10 Years Old (ELI10)" · "Why Vibe Coders Break It In Production" · "Production Architectural Solution"
- **Card de sandbox no detalhe**: "See it in action → {SandboxName}"
- **Status de readiness** (por faixa): 0–24% "Rough sketch" · 25–49% "Getting there" · 50–74% "Battle-tested-ish" · 75–99% "Almost mission ready" · 100% "Mission ready 🚀" (sem emoji — "Mission ready")
- **Rodapé**: "Built as a survival guide for vibe coders heading to production."

---

## 16. Contratos de componentes (props e APIs internas)

```ts
// site-header.tsx
SiteHeader({ readinessPercent?: number }) // compacto; barra só ≥ md

// concept-card.tsx
ConceptCard({ concept: Concept, implemented: boolean,
              onToggle: (id: number) => void })

// concept-detail.tsx
ConceptDetail({ concept: Concept, prev?: Concept, next?: Concept,
                relatedSandbox?: SandboxMeta })

// sandboxes/*.tsx — todos <SandboxProps>
interface SandboxMeta { id: SandboxId; num: number; title: string;
  blurb: string; icon: LucideIcon; conceptIds: number[] }
```

Helpers de `lib/readiness.ts`:

```ts
READINESS_KEY = "vibecoder.readiness.v1"
loadReadiness(): Set<number>          // parse tolerante; corrompido → vazio
saveReadiness(Set<number>): void
readinessPercent(Set<number>): number // Math.round(size/111*100)
```

Helpers de `lib/simulators.ts` (puros, tempo injetável):

```ts
createTokenBucket({capacity, refillIntervalMs, now?}): {
  tokens(): number; tryConsume(): {ok: boolean; remaining: number};
  tick(): void }

createCircuitBreaker({threshold, cooldownMs, now?}): {
  record(success: boolean): {state: BreakerState; blocked: boolean};
  state(): BreakerState }  // "closed" | "open" | "half-open"

simulateLatencies(n, seed): number[]      // ms, cauda longa determinística
percentile(sortedMs, p): number           // p50 / p99 / p99.9
simulateQueries(users: number, eager: boolean): {count: number; sql: string[]}
buildSqlInjection(userInput: string, safe: boolean): {sql: string; verdict: string}
createPubSubQueue({workers, flaky, maxAttempts}): {
  publish(event): void; step(): QueueStepResult } // p/ animação por frame
```

---

## 17. Checklist de QA por fase (executado antes de marcar `[x]` no roadmap)

Toda fase: build sem erros (`/tmp/observability/build-errors.log`), nenhum
novo warning de lint, e nenhum arquivo fora do recorte editado.

- **F1**: vitest `concepts.test.ts` verde; diff amostral de 15 itens contra a
  Parte 2 do planejamento (subagente QA); ids/nomes colados à fonte.
- **F2**: inspeção visual (Playwright) do header e tokens; dark mode aplicado
  a 100% das superfícies; contraste dos 5 acentos AA sobre o fundo.
- **F3**: busca por "P99", "jwt", "27" e "database" retornam resultados
  corretos; pills desativam na 2ª escolha? (não — seleção única, "All" volta);
  compartilhar `/?cat=Async` restaura o filtro.
- **F4**: rotas 1, 55, 111 resolvem; `/concepts/112` e `/concepts/abc` → 404;
  toggle reflete no header imediatamente; prev em #1 escondido, next em #111
  escondido.
- **F5**: localStorage com valor corrompido não quebra (volta a set vazio);
  score = size/111 arredondado; filtros somam corretamente.
- **F6**: cada sandbox: operar 10 ações seguidas sem erro de console; reset
  restaura estado inicial; reabrir não herda estado anterior.
- **F7**: roteiro E2E da seção 18 completo com screenshots; Lighthouse-style
  smoke: títulos únicos, meta og corretos; teclado percorre busca → cards →
  detalhe → toggle.

---

## 18. Roteiro E2E detalhado (F7)

Executar com Playwright via shell, viewport 1280×1800, screenshots em
`/tmp/browser/vibecoder/`:

1. `GET /` → screenshot home; assertar "111" visível e ≥ 111 cards no DOM.
2. Digitar "circuit" na busca → screenshot; assertar grid reduzido e sem
   estado vazio.
3. Limpar busca; clicar pill "Async" → assertar somente categoria Async.
4. Abrir card #10 (Circuit Breakers) → screenshot detalhe; assertar blocos
   ELI10/risk/fix e card "See it in action".
5. Clicar "Mark as Implemented" → assertar badge do header muda de 0%.
6. Recarregar a página → assertar toggle ainda marcado (persistência).
7. `GET /sandboxes` → abrir S1; clicar 6× "Send request" rápido → assertar
   429 no log; screenshot.
8. Abrir S2; 3× "Simulate Downstream Error" → assertar badge OPEN; screenshot.
9. Abrir S3; rodar naive vs eager → assertar 26 vs 1 queries.
10. Abrir S4; submeter a payload padrão nos dois modos → assertar vereditos.
11. Abrir S5; publicar 5 eventos com worker flaky → assertar DLQ > 0.
12. Abrir S6; enviar 100 requests → assertar p99 > p50 e histograma renderizado.
13. `GET /readiness` → assertar "Circuit Breakers" na lista Implemented e
    percentual coerente com os toggles.
14. Recolher console/network do preview → zero erros.

Critério: roteiro completo sem falha = G7 verde. Qualquer passo falho →
correção e rerun do roteiro inteiro (não só do passo).
