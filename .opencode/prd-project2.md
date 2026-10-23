# PRD — Project 2 · VibeCoder Academy: de catálogo de conceitos a ambiente de aprendizagem aplicada

> **Fonte de verdade do escopo:** `.opencode/project2.md` (planejamento central). Este PRD deriva dele, confirma afirmações no código e escolhe as soluções técnicas. Em caso de conflito no "o quê", o planejamento prevalece (plan.md).
> **Estado anterior:** Project 1 concluído (F0–F7): catálogo de 111 conceitos, 6 sandboxes, readiness checklist. Ver `docs/planning/stages/stage-07-status.md`.
> **Fronteira:** sem login, sem infraestrutura operacional, sem backend. Tudo permanece client-side (localStorage tolerante + lógica pura testável). Persistência de servidor é decisão futura e não bloqueia valor pedagógico.

## 1. Base confirmada no código (verificação do planejamento)

| Afirmação do planejamento | Verificação no código |
|---|---|
| Modelo do conceito é `id, name, cat, eli, risk, fix` | `src/lib/concepts.ts` (interface `Concept`, arquivo gerado — não editar à mão) |
| Detalhe = 3 blocos textuais quase idênticos | `src/routes/concepts.$id.tsx` (ELI10/risk/fix + toggle prev/next) |
| Navegação por anterior/próximo numérico | idem |
| Home = mural de 111 cards com busca | `src/routes/index.tsx` |
| Readiness = autodeclaração + % marcados/111 com "Mission ready" | `src/lib/readiness.ts`, `src/hooks/use-readiness.ts`, `/readiness` |
| 6 simuladores com lógica pura e rng/tempo injetáveis | `src/lib/simulators.ts`, componentes em `src/components/sandboxes/` |
| Hub de sandboxes em página longa com `?s=` | `src/routes/sandboxes.tsx` |
| Design system "Mission Control" escuro com acento violeta dominante | `src/styles.css` (tokens OKLCH) |
| Textos dos blocos renderizam em CSS `uppercase` | regra registrada em `AGENTS.md` (raiz) — deve mudar nesta rodada |

O planejamento também mapeia **6 lacunas de precisão** (§3.1). Este PRD as transforma em especificações verificáveis (seção 4) — são prioridade de qualidade conceitual, não melhoria cosmética.

## 2. Princípios técnicos herdados e mantidos

1. **Lógica pura, componentes burros.** Simuladores, exercícios e percentis continuam em `src/lib/*.ts` com tempo/rng injetáveis; componentes apenas renderizam estado retornado. Testes injetam rng determinístico (falha da fila do worker indisciplinado permanece `rng() < 0.75` onde o modelo pedir aleatoriedade).
2. **Estado global compartilhado via `useSyncExternalStore`** com `getServerSnapshot` estável neutro (regra D3 do Project 1: SSR renderiza estado neutro, hidratação sem mismatch).
3. **IDs canônicos 1..111 preservados.** Nenhuma rota, link ou dado existente quebra; `?q=`/`?cat=` da home continuam válidos; `?s=` dos sandboxes continua resolvendo (compat de deep-link, D5).
4. **Qualidade acima de volume.** Nenhum conteúdo novo entra sem objetivo observável, limite declarado e forma de prática verificável (planejamento §7, §19).
5. **Gates obrigatórios:** `bunx tsgo --noEmit` limpo + `bunx vitest run` verde + E2E Playwright antes de fechar fase.
6. **Sem `ask` durante o remix** (plan.md): dúvida → decisão registrada na seção 12 deste PRD.

## 3. Decisões técnicas (D1–D14)

### D1 — Camada editorial `lessons`: contrato de lição v2
- **Arquivo:** `src/lib/lessons/index.ts` agrega lições por categoria em `src/lib/lessons/{cat-lower}.ts` (ex.: `traffic.ts`, `database.ts`). A separação por categoria permite autorização paralela por subagentes sem conflito de arquivo.
- `concepts.ts` permanece intocado (gerado). A lição referencia o conceito por `id` canônico.
- **Contrato `Lesson`** (campos opcionais salvo onde marcado obrigatório; ausência de campo = camada ainda não autorizada):

```ts
export interface Lesson {
  id: number;                 // obrigatório
  rev: string;                // obrigatório — versão editorial, ex. "2.1"
  objective: string;          // obrigatório — ação observável em contexto definido
  prereqIds: number[];        // ids canônicos; atalho de retomada na aula
  mentalModel: {
    definition: string;       // definição técnica correta
    analogy: string;          // analogia revisada (ELI10 vira entrada, não limite)
    analogyLimits: string;    // obrigatório — onde a analogia quebra
    correspondence: [string, string][]; // [elemento técnico, elemento da metáfora]
  };
  scenario: {
    system: string; data: string; symptom: string;
    constraints: string[]; baseline: string;
  };
  representation: RepresentationSpec;   // ver D6
  worked: { decision: string; reasoning: string[] };
  contrast: { alternative: string; tradeoff: string; whenNotToUse: string }[];
  misconceptions: { wrong: string; discriminant: string; counterexample: string }[];
  practiceIds: string[];      // ids do motor de prática (D8)
  evidenceCriteria: string[]; // o que sustenta dizer "aprendi"
  transfer: { variant: string; domain: string };
  provenance: { reviewed: boolean; notes: string };
}
```

- **Teste de contrato** (`src/test/lessons.test.ts`): ids válidos 1..111, sem duplicata entre arquivos, campos ≥ 1 frase, `misconceptions[].counterexample` não vazio, `analogyLimits` não vazio, `practiceIds` existem no motor de prática, arquivo da categoria = categoria do conceito.

### D2 — Cobertura gradual, render em camadas
- `src/lib/lessons/coverage.ts` exporta `LESSON_COVERAGE: number[]` (ids com lição completa) derivado dos arquivos de lições; teste garante que nenhum id aparece duas vezes.
- `/concepts/$id` renderiza: lição completa quando `id ∈ LESSON_COVERAGE`; senão os blocos legados (ELI10/risk/fix) com aviso editorial honesto ("esta aula ainda não tem a versão profunda — o resumo clássico permanece válido como referência rápida"). **Nunca fingir profundidade inexistente** (planejamento §20).
- Onda 1 autoriza lições de **3 categorias âncora** (Traffic, Performance, Resilience — as que os três primeiros percursos usam); ondas seguintes expandem. Não é obrigatório cobrir 111 nesta rodada (planejamento §19: "Não confundir evolução com volume").
- Conteúdo da onda 1: Traffic = ids 1, 3, 4, 5 (Rate Limiting, Load Balancing, Reverse Proxies, API Gateways); Performance = ids 2, 27, 91 (Caching, N+1 Queries, Percentis/P99); Resilience = ids 10, 11, 12, 13 (Circuit Breakers, Timeouts, Retries, Exponential Backoff). 11 lições âncora.

### D3 — Correção das 6 lacunas de precisão (especificações na seção 4)
Cada lacuna vira spec com aceite mensurável e teste de lógica. As correções acontecem na lógica pura (`simulators.ts`, novos módulos) ANTES da nova UI dos laboratórios.

### D4 — Relações com significado
- `src/lib/relations.ts`:

```ts
export type RelationKind = "prereq" | "contrast" | "composition" | "context" | "practice";
export interface Relation { from: number; kind: RelationKind; to: number; note?: string }
export const RELATIONS: Relation[]; // aulas referenciam por id canônico
```

- `SANDBOX_LINKS` deixa de ser `Record<number, SandboxId>` e passa a `Record<number, { id: SandboxId; relation: "practice" | "context" }>` — Exponential Backoff → rate limiter vira `"context"` (apoio), não prática direta (lacuna §3.1.5). XSS/WAF → SQL injection: removidos da prática, permanecem apenas como contexto textual separado na lição.
- Relações seed obrigatórias (mínimo do contrato, expandíveis por lição): `1→13` (contrast: limitar de um lado vs insistir do outro), `10→12` (composition: breaker usa retry policy), `11→13` (composition: backoff supre timeout), `2→27` (contrast: cache evita ida, lote agrupa idas), `25→27` (prereq: JOIN resolve o padrão N+1), `15→16` (contrast: fan-out vs competing consumers), `16→17` (composition: DLQ alimenta a fila), `93→92` (composition: percentis calculados sobre distribuição de latência).
- A lição usa `relations` para o bloco "para continuar": próximo passo com motivo (pré-requisito faltante, contraste ou prática), não "id seguinte".

### D5 — Rotas e compatibilidade
| Rota | Papel v2 | Compat |
|---|---|---|
| `/` | Ponto de trabalho (continuar / começar por problema / biblioteca) | `?q=`, `?cat=` preservados |
| `/concepts/$id` | Aula v2 (oficina específica) | mesmo path, ids 1..111, 404 fora do range |
| `/labs/$id` | **Laboratório focado** (bancada de investigação, um experimento por página) | novo |
| `/sandboxes` | Hub de escolha: comparar laboratórios por fenômeno/decisão/pré-requisito | `?s=` redireciona para `/labs/$id` (redirect client-side do router) |
| `/progress` | **Mapa de aprendizagem** honesto (dimensões D7/D9) | novo |
| `/readiness` | Registro de aplicação no próprio app (autodeclaração, renomeado editorialmente; dados preservados) | mesmo path, mesmos dados |
| `/missions`, `/missions/$slug` | Missões integradas (F7) | novo |

- Header global: nav = Biblioteca · Laboratórios · Progresso · Meu app. Badges do header continuam, agora alimentados pelo registro de aplicação (D7).
- A rota de laboratório valida o id: fora dos 6 conhecidos → `notFound()` (padrão de `/concepts/$id`).

### D6 — Representação central por categoria (instrumentos)
- `RepresentationSpec` descreve o instrumento da lição:

```ts
export type InstrumentKind = "request-flow" | "latency-histogram" | "state-machine"
  | "event-track" | "query-explainer" | "timeline" | "table";
export interface RepresentationSpec {
  kind: InstrumentKind;
  caption: string;            // o que observar
  data: Record<string, unknown>; // shape por kind (tipado no componente)
  textEquivalent: string;     // versão textual/tabela para a11y
}
```

- Família única de instrumentos em `src/components/instruments/`, não 15 microsites (planejamento §10.1): o mesmo motor de render desenha cada kind com eixos/legenda/entidades nomeadas/direção das conexões + equivalente textual.
- Onda 1 entrega os três motores base: `request-flow` (requisições, destinos, capacidade, linha do tempo — Traffic), `latency-histogram` + `timeline` (distribuição com eixos/unidades/intervalos/contagens — Performance), `state-machine` (estados, transições rotuladas, orçamento de tempo — Resilience). Demais categorias reutilizam esses motores com dados próprios (`event-track`, `query-explainer`, `table` chegam nas ondas de expansão).
- Contrato comum do instrumento: `props: { spec: RepresentationSpec; interactive?: boolean; onInspect?: (entity: string) => void }`; estados visuais derivam de tokens (D12), nunca de cor hardcoded.

### D7 — Estado de aprendizagem e evidências
- **Arquivo:** `src/lib/learning.ts` (load/save/merge tolerante a storage corrompido — padrão `readiness.ts`) + `src/hooks/use-learning.ts` (`useSyncExternalStore`, server snapshot neutro estável: objeto vazio congelado).

```ts
export interface Attempt {
  taskId: string; conceptId: number; ts: number;
  help: 0 | 1 | 2 | 3;                       // 0 = sem apoio; 3 = solução revelada
  criteria: Record<string, boolean>;         // rubrica avaliada
  outcome: "met" | "partial" | "missed";
}
export interface LearningState {
  contact: Record<number, number>;           // conceptId -> ts do último acesso
  attempts: Attempt[];
  application: Record<number, { ts: number; note?: string; nA?: boolean }>; // autodeclaração legada
  missions: Record<string, { step: string; dossier?: string; ts: number }>;
  objective?: { goal: string; ts: number };
  reviews: { taskId: string; dueTs: number; doneTs?: number }[]; // retenção (D9)
}
```

- **Chave única:** `vibecoder-learning-v1`. Corrompido → estado vazio + flag `corrupt` para a UI avisar com transparência (mesmo padrão do readiness).
- **Regra de honestidade:** os dados do checklist antigo migram 1:1 para `application` e mantêm significado de autodeclaração — **nunca** reinterpretados como domínio (planejamento §14.3, §20). `readiness.ts` passa a ler/escrever dentro de `learning.ts`; o hook `use-readiness` mantém API para o header durante a transição e é deprecado no fim.
- Nada disso vai para servidor nesta rodada. Continuidade é local e transparente na UI ("salvo neste dispositivo").

### D8 — Motor de prática
- **Arquivo:** `src/lib/exercises.ts` (motor) + `src/lib/exercises-data/{cat-lower}.ts` (tarefas por categoria, autorizadas em paralelo).

```ts
export type TaskType = "predict" | "order" | "compare" | "find-flaw" | "variant" | "choose-info";
export interface Option { key: string; label: string }
export interface Answer { picked?: string[]; text?: string; order?: string[] }
export interface Task {
  id: string; conceptId: number; type: TaskType;
  prompt: string; context?: string; options?: Option[];
  rubric: Rubric; helpLevels: string[];
}
export interface Rubric {
  criteria: { key: string; label: string; check: (a: Answer) => boolean }[];
  validAlternatives?: string[][];             // combinações de picks aceitas com trade-off explicado
  expected: string;                           // raciocínio comentado revelado no nível 3
}
export function evaluate(task: Task, answer: Answer, helpUsed: number):
  { outcome: "met" | "partial" | "missed"; criteria: Record<string, boolean>; feedback: Feedback };
export interface Feedback {
  verdict: string;              // decisão tomada vs critério
  causes: string[];             // causa provável do equívoco, por critério quebrado
  nextStep: string;             // próxima ação concreta
  tradeoffs?: string;           // quando a resposta é alternativa válida
}
```

- Feedback é **diagnóstico utilizável** (planejamento §9.7): decisão tomada, critério atendido ou não, causa do equívoco, próxima ação. Nunca "errado, tente novamente" nem elogio genérico.
- Proibições do planejamento §6.3 viram critérios de aceite do teste do motor: nenhuma tarefa cuja resposta esteja no nome do botão; nenhuma alternativa caricatural; nenhuma pergunta puramente vocabular.
- Tipos obrigatórios no motor (os 6): `predict` (prever antes de revelar), `order` (ordenar eventos/identificar onde a suposição quebra), `compare` (duas soluções + justificativa com alternativas válidas), `find-flaw` (hipótese não sustentada por gráfico/log/código), `variant` (transferência com nomes trocados), `choose-info` (qual informação falta antes de recomendar).
- Nível de apoio registrado no `Attempt.help`: resposta correta com solução revelada não conta como "Demonstrado" (D9) — nova tentativa exige variante (nunca a mesma pergunta).

### D9 — Progresso honesto
- `/progress` calcula por conceito e por competência as dimensões do planejamento §14.1: **Contato · Prática · Demonstrado no contexto · Transferido · Retido · Aplicação declarada**.
- Cada dimensão tem denominador explícito e rotulado ("3 de 111 conceitos têm aula profunda"; "2 de 6 laboratórios têm desafio"). Sem percentual global único, sem "Mission ready".
- Semântica por dimensão (fonte de cálculo):
  - Contato: `learning.contact` tem entrada para o conceito.
  - Prática: existe `Attempt` do conceito com outcome ≠ missed.
  - Demonstrado no contexto: `Attempt` com `help ≤ 1` e todos os critérios `true` (sem apoio decisivo — help 2–3 não qualifica).
  - Transferido: `Attempt` de tarefa `variant` do conceito com outcome met.
  - Retido: `Attempt` de variante reagendada (`reviews`) com dueTs > 72h do original e outcome met.
  - Aplicação declarada: entrada em `application` (autodeclaração, sempre rotulada como tal).
- "Retido" nesta rodada = recuperação via tarefa `variant` reagendada com intervalo fixo inicial de 72h, declarado na UI como hipótese de calibração (planejamento §14.4). Sem fila punitiva: no máximo 3 itens de revisão sugeridos por sessão.
- `recommendNext(state, objective)` (D11) alimenta "o que fazer a seguir": prioriza revisão pendente → lacuna de pré-requisito de missão ativa → próxima etapa do percurso → desafio sem tentativa.

### D10 — Missões integradas
- Rotas: `/missions` (índice com briefing/resultado/produto de aprendizagem por missão) e `/missions/$slug`.
- Rodada entrega **2 missões** (profundidade antes de quantidade — planejamento §12): `charged-but-lost` (12.1) e `slow-catalog` (12.2). As demais ficam no roadmap como fases futuras.
- Estrutura da missão (dados em `src/lib/missions.ts`, lógica pura):

```ts
export interface MissionStep {
  id: string; kind: "briefing" | "predict" | "experiment" | "decide" | "transfer" | "dossier";
  title: string; body: string;
  labId?: SandboxId;         // etapa de experimento reusa bancada do /labs/$id
  taskId?: string;           // etapa de prática usa o motor (D8)
  needsEvidence?: string;    // evidência exigida para avançar (ex.: screenshot não; critério sim)
}
export interface Mission { slug: string; title: string; product: string; steps: MissionStep[]; transferVariant: string; }
```

- Cenário recorrente: **Loja Digital** (catálogo + processamento de pedidos) — diminui carga de reaprender contexto; a variante de transferência muda de domínio (documento/pedido → feed/arquivos).
- A missão nunca informa antecipadamente qual padrão é a resposta. Dossiê final salvo em `learning.missions[slug]` com hipótese, evidência escolhida, decisão e aprendizado.

### D11 — Personalização leve, explicável, sem conta
- Objetivo escolhido (`learning.objective`) influencia: home (próxima ação), recomendações de lição (motivo curto exibido, ignorável).
- Sem perfis de estilo de aprendizagem, sem competência por velocidade, sem inferência de desinteresse (planejamento §13).
- Recomendação = função pura `recommendNext(state: LearningState, objective?: string): Recommendation` em `src/lib/recommend.ts`, com `reason: string` obrigatória (ex.: "Retome esta prática porque sua última decisão confundiu timeout com confirmação de falha").
- Tempo disponível (controle simples na home) sugere unidade menor; não muda nível de conhecimento presumido.

### D12 — Identidade visual v2 ("editorial com instrumentos de engenharia")
- Evolução dos tokens OKLCH em `src/styles.css`, não troca de marca:
  - novos tokens semânticos: `--paper` (superfície de leitura clara para blocos editoriais longos), `--paper-muted`, `--accent-2` (segundo acento funcional para estado: sucesso/aviso/alerta), `--ink` (hierarquia de texto sobre paper);
  - o violeta permanece papel de marca (header, CTA primário) e perde a dominância; estados informativos migram para `--accent-2` e tons neutros;
  - contraste mínimo AA em todos os textos sobre paper e sobre o shell escuro.
- Tipografia: corpo de estudo em texto corrido confortável; monoespaçada só para código/identificadores/dados; **fim do `uppercase` em textos explicativos** (muda a checagem E2E que comparava `body.upper()` — atualizar roteiro na F8). Uppercase restrito a rótulos curtos de UI (tabs, badges).
- Composição: seções editoriais abertas com divisórias; cards só para itens repetidos e resultados individuais; gráficos e diagramas grandes o bastante para ler e manipular; sem caixas dentro de caixas.
- Estados planejados para toda bancada (D12 do planejamento §15.4): inicial, em execução, pausado, concluído, inconclusivo, fora-do-modelo, sem evidência, retomada. A qualidade percebida mora nessas transições.
- Controles: sliders/inputs para parâmetros, seleção segmentada para modos, switches para condições binárias, ícones com nome acessível para pausa/passo/reset. Toda ação tem consequência previsível: executar ≠ comparar ≠ aplicar configuração ≠ reiniciar.

### D13 — Mobile e acessibilidade
- Mobile desenhado da tarefa: cenário e pergunta antes da bancada; resultado acessível sem rolar a página inteira; rolagem horizontal restrita a código/timeline; instrumentos largos ganham visão resumida + inspeção por entidade/etapa.
- Toda representação tem equivalente textual/tabela (`textEquivalent` do D6); nada depende de hover; estados diferenciados por texto+forma além de cor; `prefers-reduced-motion` preserva o raciocínio do experimento.
- Interações essenciais por teclado com nomes acessíveis; foco previsível ao avançar etapas; nada de anunciar cada linha de log a quem usa leitor de tela (resumo + região viva discreta).
- Zoom/texto maior sem perder controles; títulos, números e unidades nunca truncam o significado.

### D14 — Verificação
- Vitest cresce por fase (lições, relações, exercícios, correções de simulador, learning store, recommend, missões). Rodada fecha com **≥ 60 testes** verdes.
- E2E Playwright estendido (roteiro da seção 10): cobre aula v2, laboratório focado, deep-link `?s=`, missão completa, progresso honesto, compat `?q=`/`?cat=`, hidratação sem mismatch.
- Gates por fase registrados no `roadmap-proj2` com números reais.

## 4. Especificações de correção (lacunas §3.1 do planejamento)

### 4.1. SQL Injection (S4) — semântica coerente
- Coleção fictícia de usuários fixa (≥ 4 registros, um com nome contendo apóstrofo, ex. `O'Brien`).
- **Modo concatenação** — o motor resolve a expressão resultante para os casos suportados:
  - entrada sem metacaracteres → busca literal, resultado coerente (0 ou 1 linha conforme o dado);
  - `x' OR '1'='1` → bypass com explicação de **precedência correta**: em `WHERE user='x' OR '1'='1' AND pass='secret'`, o `AND` liga antes, então o payload clássico **não** desliga a senha por si só; o veredito explica isso e mostra por que variantes (ex. `x' OR '1'='1' --`, `'; DROP TABLE --`) comentam o resto da cláusula;
  - `'; DROP TABLE --` → efeito de encadeamento de statement explicado no modelo didático, sem fingir execução real;
  - qualquer outra entrada → estado **"fora do modelo"** (D12): "este caso não está no modelo; aqui está o mecanismo para você raciocinar". Nunca veredito inventado.
- **Modo parametrizado:** retorna linhas quando o parâmetro casa literalmente com o dado (pode logar!) e 0 caso contrário; nunca promete vazio por definição.
- UI destaca tokens de código vs dado na expressão exibida.
- Assinatura da lógica pura:

```ts
export function evaluateSqlInjection(input: string, mode: "concat" | "parameterized"): {
  supported: boolean; sql: string; rows: string[]; tokens: { code: string[]; data: string[] };
  verdict: string; precedence?: string;
}
```

- Aceite: teste cobre os 4 casos acima + literal com apóstrofo no modo parametrizado.

### 4.2. Pub/Sub + Queue (S5) — dois modos conceituais
- Modo **competing consumers** (fila compartilhada, N workers, retry no mesmo worker, DLQ após 3 tentativas — mantém o comportamento corrigido do Project 1).
- Modo **fan-out** (assinantes independentes: cada evento é entregue a cada assinante; falha de um assinante não atrasa os outros; rastreador de entrega por assinante: pending → delivered → acked / retry → dead).
- Causas de falha explícitas e separadas: **transitória** (retry ajuda), **mensagem inválida/poison** (retry não ajuda → DLQ após esgotar), **consumidor lento** (acúmulo; backpressure discutido na lição).
- Falha aleatória de worker **nunca** rotula mensagem de envenenada por si só.
- Configuração e reinício são ações separadas; trocar modo congela o último cenário para comparação, ou avisa explicitamente que o cenário reinicia (nunca apagar tentativas silenciosamente — planejamento §9.6).
- Assinatura:

```ts
export type QueueMode = "competing" | "fanout";
export type FailureKind = "transient" | "poison" | "slow";
export function createPubSubQueue(opts: {
  mode: QueueMode; workers?: number; flakyWorker?: number | null;
  failure?: FailureKind; maxAttempts?: number; rng?: () => number;
}): QueueController; // publish/step/snapshot/setFlaky/reset preservados; fanout adiciona deliveries por assinante
```

- Aceite: teste prova (a) fan-out entrega o mesmo evento a todos os assinantes; (b) falha transitória + retry success ≠ DLQ; (c) poison esgota e vai para DLQ; (d) consumidor lento acumula fila sem incrementar DLQ.

### 4.3. N+1 (S3) — modelo didático honesto
- Parâmetros: tamanho da lista (10/25/50), cardinalidade (1 / média 2 / média 5 endereços por usuário), custo de ida-e-volta (ms configurável).
- Três estratégias comparáveis sob os mesmos dados: por-item, lote (`WHERE user_id IN (...)`), JOIN.
- Latência = fórmula transparente exibida (`idaVoltas × custo + linhas × ε`), rotulada "modelo didático, não benchmark". Nada de "JOIN = 14 ms" fixo.
- Sem afirmação de index scan sem representar o índice; a lição separa "menos consultas" de "melhor desempenho" e aponta quando o lote/JOIN aumenta volume ou altera paginação.
- Assinatura:

```ts
export function simulateQueries(opts: {
  users: number; cardinality: 1 | 2 | 5; roundTripMs: number; strategy: "per-item" | "batch" | "join";
}): { count: number; sql: string[]; latencyMs: number; rows: number; formula: string }
```

- Aceite: teste prova que por-item = users+1 consultas sempre; que lote e JOIN reduzem o count independentemente da cardinalidade; que a latência respeita a fórmula exibida.

### 4.4. P99 (S6) — rigor de cálculo
- Convenção **nearest-rank** exibida na UI junto à definição.
- Exemplo obrigatório acessível na bancada: 99×100 ms + 1×10.000 ms → **P99 = 100 ms, máx = 10.000 ms, média = 199 ms** (teste de lógica fixa os três valores exatos).
- Histograma com eixos, unidades, intervalos e contagens; marcadores de percentil; lista ordenada complementar; nota explícita de que P99.9 com 100 amostras é frágil para inferir população.
- A geração probabilística passa a **garantir 1 cauda singular por amostra de 100** (a legenda só descreve o que o modelo garante — planejamento §3.1.4).
- Assinatura mantida (`simulateLatencies(n, seed)`, `percentile(sorted, p)`), com `simulateLatencies` ajustada para garantir exatamente 1 observação > 0.99 por 100.

### 4.5. Links conceito–laboratório
- Relação tipada (D4). Mapeamento direto só onde o laboratório demonstra o mecanismo: rate limiting (1, 13→context) → S1; circuit breaker/timeouts/retries (10, 11, 12) → S2; N+1/JOIN/lote (27, 25, 26) → S3; SQL injection (78, 79) → S4; fila/retry/DLQ/competing consumers (15, 16, 17, 20) → S5; percentis/latência (93, 92, 91, 94) → S6. Backoff, XSS, WAF, índices viram `"context"` com nota de alcance (o que o laboratório **não** demonstra).

### 4.6. Analogias
- Toda lição v2 traz `analogyLimits` + correspondências (D1). Casos do planejamento: CAP com contexto de partição; deadlock vs livelock discriminados por invariante (quem espera vs quem gira). A revisão acontece na autorização da lição, não como patch de texto solto.

## 5. Escopo por fase (F0–F9) com entregas e critérios de aceite

> Ordem de dependência. Fases 2–4 paralelizáveis em ondas (seção 6). Gates detalhados no `roadmap-proj2`.

**F0 — Contratos.** Decisões D1–D14 congeladas; `AGENTS.md` da raiz recebe as regras estruturais novas (camada lessons separada do arquivo gerado, learning store como fonte única de estado, relações tipadas, fim do uppercase em explicações). Sem código de produto. *Aceite: AGENTS.md atualizado; PRD e roadmap coerentes entre si (título/fases/escopo).*

**F1 — Fundação editorial.** `lessons/index.ts` + contrato + `coverage.ts`; `relations.ts` tipado com seed D4; `exercises.ts` com o motor e os 6 tipos; `learning.ts` + `use-learning.ts` (transição do readiness, dados legados preservados — teste prova que um checklist antigo vira `application` sem virar domínio). *Aceite: testes de contrato de lições, relações, motor e store verdes; tsgo limpo.*

**F2 — Precisão dos simuladores.** Correções 4.1–4.5 na lógica pura + testes. Componentes existentes continuam funcionando com a lógica nova (UI antiga, lógica nova). *Aceite: todos os testes da seção 4 verdes; nenhum comportamento antigo quebrado além do especificado (mapa de links tipado).*

**F3 — Laboratório focado.** `/labs/$id` com bancada completa para os 6 laboratórios (cenário → controles → representação → evidência → interpretação → desafio); hub `/sandboxes` vira página de escolha comparativa; deep-link `?s=` compatível; instrumentos `request-flow`, `latency-histogram`, `state-machine`. *Aceite: as 6 rotas resolvem; `?s=` redireciona; tentativa anterior preservada ao trocar configuração; estados D12 presentes; E2E dos fluxos 3–6 da seção 10.*

**F4 — Aula v2.** `/concepts/$id` renderiza lições completas (divulgação progressiva: resumo rápido → caminho aprofundado), representação central, exemplo trabalhado, contraste, equívocos, prática com feedback diagnóstico, próximo passo com motivo. Blocos legados para conceitos sem lição. *Aceite: 11 lições âncora renderizam completas; 100 conceitos restantes mostram blocos legados + aviso honesto; fluxo E2E 2 da seção 10.*

**F5 — Progresso honesto.** `/progress` com as 6 dimensões e semântica D9, denominadores rotulados, evidências inspecionáveis, "o que fazer a seguir" via `recommendNext`; `/readiness` renomeado para registro de aplicação. *Aceite: dimensões calculadas com as regras exatas da D9 (testadas); nenhum percentual global; E2E fluxo 7.*

**F6 — Home ponto de trabalho.** Primeiro acesso (identidade + começar por problema vs explorar biblioteca + missão introdutória) vs retorno (atividade em andamento + revisão pertinente); busca por sintoma/sinônimo na biblioteca; teasers de laboratório com fenômeno observável. *Aceite: `?q=`/`?cat=` preservados (teste de rota); home de retorno leva ao ponto exato (E2E fluxo 1); estado vazio de busca com 3 rotas de saída.*

**F7 — Missões.** `/missions` + 2 missões completas reusando bancadas e motor de prática; dossiê salvo. *Aceite: E2E fluxo 8; dossiê persiste após reload; transferência com domínio trocado.*

**F8 — Identidade v2 e a11y.** Tokens paper/acento secundário; fim do uppercase em explicações; tipografia e densidade; mobile por tarefa; equivalências textuais; teclado e reduced-motion. Atualização do roteiro E2E para os checks de texto. *Aceite: nenhum hardcoded color; contraste AA; E2E roda com o roteiro atualizado; screenshots de desktop+mobile.*

**F9 — Verificação e fechamento.** E2E completo (seção 10), ≥ 60 testes, tsgo limpo, stage status em `docs/planning/stages/`, relatório ao monitor, mensagem "remix finalizado (+N)". *Aceite: aceite global da seção 9 integral.*

## 6. Enxame de subagentes (pacotes e ondas)

- **Onda 0 (agente principal):** F0 + F1 (contratos e fundação — nada paralelo antes disso).
- **Onda 1 (paralela, 3 pacotes):**
  - `s1-licoes`: autoriza as 11 lições âncora (dono: `src/lib/lessons/traffic.ts`, `performance.ts`, `resilience.ts`) + revisão de analogias; consome contrato D1 e motor D8 já existentes.
  - `s2-precisao`: correções 4.1–4.5 (dono: `src/lib/simulators.ts`, typing de `SANDBOX_LINKS` em `simulators.ts`, `src/test/simulators.test.ts`).
  - `s3-exercicios`: tarefas de prática para as lições âncora (dono: `src/lib/exercises-data/*.ts`), consumindo o contrato do motor.
- **Onda 2 (paralela, 2 pacotes):**
  - `s4-bancadas`: `/labs/$id` + instrumentos D6 (dono: `src/routes/labs.$id.tsx`, `src/routes/sandboxes.tsx`, `src/components/instruments/*`, `src/components/sandboxes/*`).
  - `s5-aula`: `/concepts/$id` v2 (dono: `src/routes/concepts.$id.tsx`, `src/components/lesson/*`).
- **Onda 3:** F5+F6 (progresso, home) — agente principal + subagente revisor de contrato se houver divergência.
- **Onda 4:** F7 (missões) e F8 (visual/a11y) em paralelo se onda 2 estiver integrada; senão sequencial.
- **F9 sempre do agente principal** (gates globais, E2E, stage status, monitor).
- Cada pacote recebe os 3 pilares centrais + os 3 pilares próprios em `.opencode/work/sub/{K}/`, conforme skill `subagentes-3-pilares`; system prompt = molde da skill (regras + pilares íntegros).

## 7. Especificação das superfícies (estrutura de componente)

### 7.1. Home `/`
- Estados de leitura: primeiro acesso (nenhum contato/objetivo) vs retorno (contato ou objetivo presentes em `learning`).
- **Primeiro acesso:** identidade da Academy (título + promessa honesta), escolha entre "começar por um problema" (3 portas de problema — requisição perdida / página lenta / fila acumulando) e "explorar a biblioteca", missão introdutória concreta (cartão único), acesso evidente aos laboratórios. Biblioteca aparece como recurso, não como mural.
- **Retorno:** atividade em andamento (missão em etapa X / bancada retomável / aula aberta ontem), 1 revisão pertinente se `reviews` tiver item vencido, objetivo escolhido com acesso direto. Controle simples de "tempo disponível" (5/15/30 min) ajusta a sugestão.
- Busca: mantém estado local + debounce 250 ms + sincronização `?q=`/`?cat=` (padrão do Project 1). Resultados agora casam **nome, sigla, sinônimo e sintoma** (mapa de sintomas em `src/lib/symptoms.ts`: "minha fila cresce" → 15, 16, 17, 20 + S5).
- Cards: problema/objetivo (1ª linha), nível, tipo de experiência (aula / comparação / laboratório); sem toggle de "implementado" disputando o clique.
- Teasers de sandboxes: fenômeno observável + decisão praticada, com deep-link para `/labs/$id`.

### 7.2. Aula `/concepts/$id` (com lição completa)
- Abertura: nome literal do conceito + problema + objetivo + acesso ao ponto relevante.
- Estrutura vertical com âncoras: Modelo mental (definição → analogia → limites → correspondências) → Cenário concreto (baseline + restrições) → Representação central (instrumento D6) → Exemplo trabalhado (decisão + raciocínio) → Contraste (alternativas e quando NÃO usar) → Equívocos (com contraexemplos) → Prática (tarefas do motor, com previsão antes de revelar) → Evidência (critérios da lição + resultados das tentativas) → Transferência (variante) → Para continuar (relações D4 com motivo).
- Divulgação progressiva: bloco "Resumo rápido" (equivalente ao antigo ELI10/risk/fix, visível de início) + "Caminho aprofundado" (o corpo acima) — referência e estudo na mesma página, sem duplicação editorial.
- Bloco de aplicação (checklist legado) fica no fim, rotulado "Registro no seu app", separado da prática.

### 7.3. Laboratório focado `/labs/$id`
- Layout em áreas distintas: **cenário** (contexto + pergunta do experimento), **controles** (parâmetros + ações com significado), **representação** (instrumento), **evidências** (logs/eventos relevantes), **interpretação** (previsão → resultado → comparação → explicação causal), **desafio** (tarefa do motor `predict`/`compare`).
- Uma única ação principal por etapa. Controles de pausa/passo/reinício/comparação com significado consistente entre laboratórios.
- Alterar configuração nunca apaga tentativa silenciosamente: preserva comparação ou avisa explicitamente o reinício.
- Logs são evidência secundária com evento relevante explicado; resultados com unidades, baseline e limites.

### 7.4. Hub `/sandboxes`
- Comparação por: fenômeno observado, decisões praticadas, pré-requisitos, tipo de interação (demonstração curta / experimento guiado / desafio).
- Cada cartão leva a `/labs/$id` com contexto próprio e ligação de retorno à aula de origem.
- `?s=` preservado via redirect (D5).

### 7.5. Progresso `/progress`
- Visão por competência (categoria) e por objetivo: linha do conceito mostra as dimensões com fonte da evidência clicável (abre o `Attempt`).
- Denominadores rotulados por recorte; destaques de "o que fazer a seguir" (máx. 3).
- Registro de aplicação em seção separada com contexto/justificativa/"não se aplica".

### 7.6. Missão `/missions/$slug`
- Trilha de etapas `MissionStep` com progresso visível; etapa de experimento embute a bancada do `/labs/$id` (mesmo componente, contexto da missão); etapa de prática embute a tarefa do motor.
- Dossiê final: fato → hipótese → evidência escolhida → ação → verificação → aprendizado; editável pelo aluno, salvo em `learning.missions`.

## 8. Migração e compatibilidade

- `readiness.ts`: mantém a API pública (`loadReadiness`, `saveReadiness`, `readinessPercent`) delegando ao `learning.ts`; migração 1:1 no primeiro load; teste prova idempotência (segundo load não duplica).
- `SANDBOX_LINKS` tipado: consumidores atuais (`concept-card`, `concepts.$id`) atualizados na mesma fase (F2) — nenhum link 404.
- `/readiness` continua acessível por link antigo (nenhum redirect necessário; conteúdo renomeado).
- `?s=` → redirect para `/labs/$id` com teste de rota.
- Header: badges de % removidos em favor do badge de aplicação declarada (honestidade); a barra de readiness some da home, o registro vira página própria.

## 9. Riscos e mitigação

| Risco | Mitigação |
|---|---|
| Lições inconsistentes entre categorias | Contrato de lição testável + amostra revisada pelo agente principal a cada onda |
| Regeneração futura de `concepts.ts` perder melhorias | Camada lessons separada do arquivo gerado (D1) |
| Hidratação quebrando com o novo store | Server snapshot neutro estável + teste de store + E2E |
| Deep links antigos quebrando | Rota `/labs` + redirect de `?s=` cobertos por teste e E2E |
| Escopo crescer para 111 lições/15 instrumentos | D2 fixa 3 categorias âncora; cobertura é decisão editorial por onda |
| Uppercase mudando checks E2E | F8 atualiza o roteiro no mesmo gate |
| Motor de prática com feedback raso | Contrato `Feedback` com causes/nextStep obrigatórios + revisão de amostra |
| Dois subagentes tocando o mesmo arquivo | Donos exclusivos por pacote (seção 6); costuras só no agente principal |

## 10. Verificação E2E (fluxos obrigatórios)

1. Home de retorno mostra atividade em andamento e leva ao ponto exato.
2. Aula v2: resumo rápido → caminho aprofundado → prática com feedback que nomeia o critério quebrado.
3. `/labs/ratelimit` abre bancada focada; prever → executar por passos → comparar duas configurações preserva a tentativa anterior.
4. `/sandboxes?s=pubsub` redireciona para `/labs/pubsub` (compat).
5. S4: entrada `' OR '1'='1` recebe explicação de precedência; entrada fora do modelo recebe estado "fora do modelo"; parametrizado casa literal e retorna a linha.
6. S6: exemplo 99×100/1×10.000 mostra P99 = 100 ms, máx = 10.000 ms, média = 199 ms.
7. `/progress` mostra dimensões com denominadores rotulados; aplicação declarada aparece em "Meu app", não como domínio.
8. Missão `charged-but-lost` completa uma volta do ciclo e salva dossiê.

## 11. Checklist de conceito legado (não migrar para domínio)

O toggle "Implemented in my app" permanece na página da aula como **registro de aplicação** (com justificativa opcional e "não se aplica"), visualmente separado da prática e do progresso. Ele nunca soma como evidência de aprendizagem.

## 12. Registro de decisões tomadas durante a rodada

*(append-only; numerar na sequência de D1–D14 quando afetarem decisão central)*

- D15 — Retenção automática: `recordAttempt` no store agenda a recuperação de toda tarefa `variant` concluída com `met` para +72h (`RETENTION_INTERVAL_MS` em `learning.ts`) e fecha o item quando a recuperação vence — nenhum componente agenda na mão. `recommendNext` recebe hints de missão via `missionHintsFromLearning` (`src/lib/missions.ts`, contrato fixado antes da onda F7). O card da missão introdutória na home aponta, até F7, para o início do percurso "The request didn't finish" (reapontar para `/missions/charged-but-lost` quando a rota existir). Feedback do motor em pt-BR alinhado aos testes de F1 ("Nenhum critério…", "variante").

## 13. Glossário de progresso (vocabulário da UI)

- **Contato** — "você consultou esta aula" · **Prática** — "você tentou N tarefas, com ajuda nível K" · **Demonstrado** — "você atendeu os critérios sem apoio decisivo" · **Transferido** — "você resolveu uma variante" · **Retido** — "recuperação após intervalo bem-sucedida" · **Aplicação declarada** — "você registrou uso no seu app" (nunca traduzida como domínio).

## 14. Validação final (perguntas do planejamento §18 aplicadas à rodada)

Antes do fechamento (F9), o agente principal revisa a entrega contra estas perguntas e registra respostas no stage status:
- Mobile e alternativas acessíveis permitem o mesmo raciocínio essencial?

## 15. Contratos de dados dos instrumentos da onda 1

### 15.1. `request-flow` (Traffic)
```ts
interface RequestFlowData {
  nodes: { id: string; label: string; kind: "client" | "edge" | "service" | "store"; capacity?: number }[];
  edges: { from: string; to: string; label?: string }[];
  window: { ts: number; accepted: number; rejected: number; destination: string }[];
  limits?: { kind: "token-bucket" | "window"; capacity: number; refillMs?: number; scope?: "ip" | "route" | "global" };
}
```
- O aluno observa para onde cada requisição foi, por que foi aceita/rejeitada e o que muda com o escopo do limite (aceite da lição de Rate Limiting: distinguir burst aceitável de fluxo sustentado incompatível).

### 15.2. `latency-histogram` (Performance)
```ts
interface HistogramData {
  unit: string;                       // "ms"
  bins: { from: number; to: number; count: number }[];
  sample: number[];                   // amostra ordenada (lista complementar)
  markers: { label: string; value: number; convention: "nearest-rank" }[];
  scenario?: { label: string; mean: number }; // comparação entre cenários com mesma média
  note: string;                       // limites do modelo (ex.: fragilidade de P99.9 com 100 amostras)
}
```
- Eixos sempre visíveis; marcadores clicáveis apontam a observação que determina o percentil (aceite do S6).

### 15.3. `state-machine` (Resilience)
```ts
interface StateMachineData {
  states: { id: string; label: string; tone: "ok" | "warn" | "down" }[];
  transitions: { from: string; to: string; trigger: string }[]; // trigger = evento explícito
  now: string;                        // estado atual (derivado da lógica pura)
  history: { ts: number; event: string; from: string; to?: string }[];
  budget?: { label: string; ms: number }; // orçamento de tempo (ex.: cooldown do breaker)
}
```
- Cada transição exibe o trigger (3 falhas consecutivas, cooldown vencido, tentativa half-open bem-sucedida) — nada acontece sem causa nomeada.

## 16. Mapa de sintomas da biblioteca (`src/lib/symptoms.ts`)

```ts
export const SYMPTOMS: { query: string[]; conceptIds: number[]; labId?: SandboxId; lead: string }[] = [
  { query: ["slow", "lento", "página lenta", "lentidão"], conceptIds: [27, 25, 26, 2, 91], labId: "nplusone",
    lead: "Round-trips redundantes, cache ou volume retornado — comece pelo visualizador de N+1." },
  { query: ["queue growing", "fila cresce", "acumulando", "backlog"], conceptIds: [15, 16, 17, 20], labId: "pubsub",
    lead: "Compare taxa de chegada e de processamento antes de mexer na capacidade." },
  { query: ["429", "rate limit", "throttled", "bloqueado"], conceptIds: [1, 13], labId: "ratelimit",
    lead: "Burst ou taxa sustentada? O bucket mostra a diferença." },
  { query: ["downstream failing", "dependência falhando", "cascading"], conceptIds: [10, 11, 12], labId: "circuit",
    lead: "Proteção, recuperação e o custo de rejeitar temporariamente." },
  { query: ["hacked", "injection", "query manipulada"], conceptIds: [78, 79], labId: "sqli",
    lead: "Onde o input vira código — e como parametrização preserva a fronteira." },
  { query: ["p99", "tail", "outlier", "some users slow"], conceptIds: [93, 94, 91, 92], labId: "tail",
    lead: "A média esconde a cauda; distribuição antes de otimização." },
];
```
- A busca da home casa sintoma/sinônimo além do nome; o resultado explica o motivo da correspondência (`lead`) e diferencia aula, comparação e laboratório (planejamento §9.2).
- Teste: cada entrada tem `conceptIds` válidos 1..111 e `lead` não vazio.

## 17. Roteiro das duas missões (F7)

### 17.1. `charged-but-lost` — "A compra foi cobrada, mas a resposta se perdeu"
1. `briefing` — Loja Digital: checkout chama o processador de pagamento; a resposta se perdeu depois da cobrança. O que o cliente vê? O que você faria?
2. `predict` — tarefa `predict` sobre timeout: o que acontece com a cobrança se o pedido expira antes da resposta? (antes de revelar)
3. `experiment` — bancada do S2/S1 adaptada: repetir a operação com e sem identificação de idempotência; observar duplicação.
4. `decide` — tarefa `compare`: política de repetição com justificativa do invariante "uma compra não gera cobrança adicional"; alternativas válidas aceitas com trade-off.
5. `transfer` — tarefa `variant`: criação de documento/pedido em outro domínio, sem a palavra pagamento no enunciado.
6. `dossier` — timeline comentada + política escolhida + invariante preservado.

### 17.2. `slow-catalog` — "O catálogo ficou lento e às vezes mostra informação antiga"
1. `briefing` — página de catálogo lenta; relatos esparsos de dado desatualizado. Primeira hipótese do aluno (coletada, não rotulada).
2. `experiment` — bancada do S3: comparar por-item / lote / JOIN sob cardinalidade e custo do cenário; separar lentidão de desatualização.
3. `decide` — tarefa `compare`: estratégia de acesso + estratégia de atualização proporcionais ao caso (cache com invalidação vs consulta direta — alternativas válidas).
4. `experiment` — bancada do S6: a "melhora" percebida aparece na média ou no P99? Qual medida responde à reclamação do usuário?
5. `transfer` — tarefa `variant`: feed com padrão de atualização diferente; o conhecimento deve sobreviver à mudança de domínio.
6. `dossier` — comparação antes/depois + decisão de acesso + estratégia de atualização + medida escolhida com justificativa.

- Regra comum: a perturbação só é revelada após a previsão; nenhum passo informa o padrão-resposta; cada missão fecha com o dossiê salvo e um item de revisão agendado (72h).

## 18. Inventário de testes da rodada (alvo ≥ 60)

| Arquivo | Cobertura obrigatória |
|---|---|
| `lessons.test.ts` | contrato de lição (ids, duplicatas, campos, limits, practiceIds, categoria) |
| `relations.test.ts` | seed D4 íntegro; kinds válidos; sem relação órfã |
| `exercises.test.ts` | motor: rubricas, help levels, feedback com causes/nextStep, proibições §6.3 |
| `exercises-data.test.ts` | tarefas âncora: 6 tipos presentes; rubricas não vazias |
| `simulators.test.ts` | specs 4.1–4.5 (casos exatos do PRD, incl. P99=100/10.000/199) |
| `learning.test.ts` | load/save/merge tolerante; migração readiness idempotente; corrompido → estado vazio |
| `recommend.test.ts` | prioridades D9; motivo obrigatório; sem recomendação vazia |
| `symptoms.test.ts` | mapa válido; leads não vazios |
| `missions.test.ts` | etapas das 2 missões; transfer com domínio trocado; nenhum spoiler do padrão |
| `app-routing.test.tsx` | rotas novas resolvem; `?s=` redirect; `?q=`/`?cat=` preservados; 404s |
| existentes (concepts, readiness, simulators antigos) | permanecem verdes, atualizados onde a API mudou |

## 19. Pilares dos subagentes — resumo de escopo (detalhe vai nos arquivos `-s{K}`)

- **s1-licoes**: dono de `src/lib/lessons/{traffic,performance,resilience}.ts`. Entrada: contrato D1 + `concepts.ts` + lacunas 4.6. Saída: 11 lições completas cobertas por `coverage.ts`. Aceite: `lessons.test.ts` verde.
- **s2-precisao**: dono de `src/lib/simulators.ts` + `src/test/simulators.test.ts`. Entrada: specs 4.1–4.5. Saída: lógica nova mantendo `SANDBOXES`/consumidores funcionando. Aceite: testes das specs verdes + nenhum 404.
- **s3-exercicios**: dono de `src/lib/exercises-data/*.ts`. Entrada: contrato D8 + lições âncora (depende de s1 para `practiceIds`; usa rascunho de tópicos acordado na onda 0 para não bloquear). Aceite: `exercises-data.test.ts` verde.
- **s4-bancadas**: dono de `src/routes/labs.$id.tsx`, `src/routes/sandboxes.tsx`, `src/components/instruments/*`, `src/components/sandboxes/*`. Entrada: D6 + lógica nova de s2. Aceite: fluxos E2E 3–6.
- **s5-aula**: dono de `src/routes/concepts.$id.tsx`, `src/components/lesson/*`. Entrada: D1/D2/D6/D8 + lições de s1. Aceite: fluxo E2E 2; 100 legados intactos.
- Costuras reservadas ao agente principal: header/nav, `coverage.ts` agregado, registro no `routeTree` (automático), gates globais, integração de conflitos de contrato.

### D15 — Correções de execução do enxame (observadas na rodada)
- Subagentes `spawn_agent` são somente leitura: não podem editar arquivos do projeto. s1 e s3 entregaram CONTEÚDO em relatório; o agente principal escreveu os arquivos. s2/s4 foram realizados diretamente pelo agente principal.
- `practiceIds` das lições foram sincronizados com as tarefas realmente autorizadas em `exercises-data` (os ids reservados divergiram entre s1 e s3; contrato prevalece: toda lição referencia tarefas existentes).
- Gate F3 revelou reset de tentativa na troca de config do S5 (fila recriada); corrigido para mutar config in-place — trocar config nunca limpa contadores/log de uma tentativa em andamento.
- Onda 4 (F7/F8): subagentes `spawn_agent` read-only produzem relatórios com entregáveis na íntegra; o agente principal escreve os arquivos, cria as rotas e roda os gates. Pilares próprios em `.opencode/work/sub/{s7-missoes,s8-identidade}/`.

