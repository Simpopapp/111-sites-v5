// Lógica pura dos 6 simuladores (PRD project2 D8 + specs de precisão §4.1–4.5).
// Tempo/rng injetáveis para testes; componentes apenas renderizam o estado
// retornado. Números de latência são MODELO DIDÁTICO, nunca benchmark.

export type SandboxId =
  | "ratelimit"
  | "circuit"
  | "nplusone"
  | "sqli"
  | "pubsub"
  | "tail";

export interface SandboxMeta {
  id: SandboxId;
  num: number;
  title: string;
  blurb: string;
  conceptIds: number[];
}

export type SandboxLinkKind = "direct" | "context";

/** Link tipado conceito→laboratório (spec 4.5): `context` declara o alcance. */
export interface SandboxLink {
  kind: SandboxLinkKind;
  sandbox: SandboxId;
  /** O que o laboratório NÃO demonstra (nota de alcance). */
  note?: string;
}

/**
 * Mapeamento conceito → laboratório (spec 4.5). `direct` só onde o
 * laboratório demonstra o mecanismo; os demais são `context` com nota.
 */
export const SANDBOX_LINKS: Record<number, SandboxLink> = {
  1: { kind: "direct", sandbox: "ratelimit" },
  13: {
    kind: "context",
    sandbox: "ratelimit",
    note: "The rate limit lab demonstrates throttling, not backoff pacing.",
  },
  10: { kind: "direct", sandbox: "circuit" },
  11: { kind: "direct", sandbox: "circuit" },
  12: { kind: "direct", sandbox: "circuit" },
  27: { kind: "direct", sandbox: "nplusone" },
  25: { kind: "direct", sandbox: "nplusone" },
  26: { kind: "direct", sandbox: "nplusone" },
  78: { kind: "direct", sandbox: "sqli" },
  79: {
    kind: "context",
    sandbox: "sqli",
    note: "The SQL lab demonstrates injection in a query; it does not demonstrate XSS in the browser.",
  },

  74: {
    kind: "context",
    sandbox: "sqli",
    note: "The SQL lab shows the query itself; it does not simulate a WAF filtering at the edge.",
  },
  15: { kind: "direct", sandbox: "pubsub" },
  16: { kind: "direct", sandbox: "pubsub" },
  17: { kind: "direct", sandbox: "pubsub" },
  20: { kind: "direct", sandbox: "pubsub" },
  93: { kind: "direct", sandbox: "tail" },
  94: { kind: "direct", sandbox: "tail" },
  91: { kind: "direct", sandbox: "tail" },
  92: { kind: "direct", sandbox: "tail" },
};

export const SANDBOXES: SandboxMeta[] = [
  {
    id: "ratelimit",
    num: 1,
    title: "Rate Limiter",
    blurb:
      "Token bucket: 5 tokens, 1 refill every 1.5s. Click fast and watch 429s appear.",
    conceptIds: [1, 13],
  },
  {
    id: "circuit",
    num: 2,
    title: "Circuit Breaker",
    blurb:
      "Closed → open → half-open. Trip the breaker with 3 downstream failures.",
    conceptIds: [10, 11, 12],
  },
  {
    id: "nplusone",
    num: 3,
    title: "N+1 Visualizer",
    blurb:
      "Compare per-item, batch and JOIN under the same data. Watch the round-trips collapse.",
    conceptIds: [27, 25, 26],
  },
  {
    id: "sqli",
    num: 4,
    title: "SQL Injection",
    blurb:
      "String concatenation vs parameterized queries — see the attack short-circuit.",
    conceptIds: [78, 79, 74],
  },
  {
    id: "pubsub",
    num: 5,
    title: "Pub/Sub + Queue",
    blurb:
      "Competing consumers vs fan-out, with transient, poison and slow-consumer failures.",
    conceptIds: [15, 16, 17, 20],
  },
  {
    id: "tail",
    num: 6,
    title: "P99 & Tail Latency",
    blurb:
      "100 requests, one long tail. See why p99 hurts more than the average.",
    conceptIds: [93, 94, 91, 92],
  },
];

export function getRelatedSandboxLink(conceptId: number): SandboxLink | undefined {
  return SANDBOX_LINKS[conceptId];
}

/** Compat: laboratório direto do conceito (undefined para links contextuais). */
export function getRelatedSandbox(conceptId: number): SandboxMeta | undefined {
  const link = SANDBOX_LINKS[conceptId];
  if (!link || link.kind !== "direct") return undefined;
  return SANDBOXES.find((s) => s.id === link.sandbox);
}

// ---------- S1 · Token bucket (Rate Limiting) ----------

export interface TokenBucket {
  tokens(): number;
  tryConsume(): { ok: boolean; remaining: number };
  tick(): void;
}

export function createTokenBucket(opts: {
  capacity: number;
  refillIntervalMs: number;
  now?: () => number;
}): TokenBucket {
  const now = opts.now ?? (() => Date.now());
  let tokens = opts.capacity;
  let last = now();
  const refill = () => {
    const t = now();
    const steps = Math.floor((t - last) / opts.refillIntervalMs);
    if (steps > 0) {
      tokens = Math.min(opts.capacity, tokens + steps);
      last += steps * opts.refillIntervalMs;
    }
  };
  return {
    tokens: () => {
      refill();
      return tokens;
    },
    tryConsume: () => {
      refill();
      if (tokens > 0) {
        tokens--;
        return { ok: true, remaining: tokens };
      }
      return { ok: false, remaining: 0 };
    },
    tick: refill,
  };
}

// ---------- S2 · Circuit breaker ----------

export type BreakerState = "closed" | "open" | "half-open";

export function createCircuitBreaker(opts: {
  threshold: number;
  cooldownMs: number;
  now?: () => number;
}) {
  const now = opts.now ?? (() => Date.now());
  let state: BreakerState = "closed";
  let failures = 0;
  let openedAt = 0;

  const cool = () => {
    if (state === "open" && now() - openedAt >= opts.cooldownMs) {
      state = "half-open";
    }
  };

  return {
    state(): BreakerState {
      cool();
      return state;
    },
    record(success: boolean): { state: BreakerState; blocked: boolean } {
      cool();
      if (state === "open") return { state, blocked: true };
      if (success) {
        failures = 0;
        state = "closed";
        return { state, blocked: false };
      }
      if (state === "half-open") {
        state = "open";
        openedAt = now();
        return { state, blocked: false };
      }
      failures++;
      if (failures >= opts.threshold) {
        state = "open";
        openedAt = now();
        failures = 0;
      }
      return { state, blocked: false };
    },
    reset() {
      state = "closed";
      failures = 0;
      openedAt = 0;
    },
  };
}

// ---------- S3 · N+1: por-item vs lote vs JOIN (spec 4.3) ----------

export type NPlusOneStrategy = "per-item" | "batch" | "join";

export interface QueryPlan {
  count: number;
  sql: string[];
  latencyMs: number;
  rows: number;
  /** Fórmula transparente exibida na UI; rotulada como modelo didático. */
  formula: string;
}

export function simulateQueries(opts: {
  users: number;
  cardinality: 1 | 2 | 5;
  roundTripMs: number;
  strategy: NPlusOneStrategy;
}): QueryPlan {
  const { users, cardinality, roundTripMs, strategy } = opts;
  const rows = users * cardinality;
  const EPSILON_MS = 1;
  let count: number;
  let sql: string[];

  if (strategy === "per-item") {
    count = users + 1;
    sql = [`SELECT * FROM users LIMIT ${users};`];
    for (let i = 1; i <= users; i++) {
      sql.push(`SELECT * FROM addresses WHERE user_id = ${i};`);
    }
  } else if (strategy === "batch") {
    const BATCH_SIZE = 25;
    count = Math.ceil(users / BATCH_SIZE);
    sql = [];
    for (let start = 1; start <= users; start += BATCH_SIZE) {
      const end = Math.min(users, start + BATCH_SIZE - 1);
      sql.push(`SELECT * FROM addresses WHERE user_id IN (${start}..${end});`);
    }
  } else {
    count = 1;
    sql = [
      `SELECT users.*, addresses.* FROM users LEFT JOIN addresses ON addresses.user_id = users.id LIMIT ${users};`,
    ];
  }

  const latencyMs = count * roundTripMs + rows * EPSILON_MS;
  const formula = `roundtrips(${count}) × ${roundTripMs}ms + rows(${rows}) × ε = ${latencyMs} ms — teaching model, not a benchmark`;
  return { count, sql, latencyMs, rows, formula };
}

// ---------- S4 · SQL injection — semântica coerente (spec 4.1) ----------

export interface SqlInjectionResult {
  supported: boolean;
  mode: "concat" | "parameterized";
  sql: string;
  rows: string[];
  tokens: { code: string[]; data: string[] };
  verdict: string;
  /** Explicação de precedência quando o payload clássico está em jogo. */
  precedence?: string;
}

/** Coleção fictícia fixa (≥ 4 registros, um com apóstrofo). */
export const SQL_DEMO_USERS = ["alice", "O'Brien", "bob", "carol"];

const SQL_META = /('|--|;|=|\bor\b|\band\b)/i;
const SQL_TOKEN_SPLIT = /('|--|;|=|\bOR\b|\bAND\b)/i;
const SQL_CODE_TOKENS = new Set(["'", "--", ";", "=", "or", "and"]);

function tokenizeInput(input: string): { code: string[]; data: string[] } {
  const parts = input.split(SQL_TOKEN_SPLIT).filter((p) => p !== "");
  const code: string[] = [];
  const data: string[] = [];
  for (const part of parts) {
    if (SQL_CODE_TOKENS.has(part.toLowerCase())) code.push(part);
    else data.push(part);
  }
  return { code, data };
}

export function evaluateSqlInjection(
  input: string,
  mode: "concat" | "parameterized",
): SqlInjectionResult {
  const tokens = tokenizeInput(input);

  if (mode === "parameterized") {
    const rows = SQL_DEMO_USERS.filter((u) => u === input);
    return {
      supported: true,
      mode: "parameterized",
      sql: `db.query('SELECT * FROM users WHERE user = $1 AND pass = $2', [\`${input}\`, password]);`,
      rows,
      tokens: { code: ["db.query", "$1", "$2"], data: [input] },
      verdict: rows.length
        ? `The driver sends the input as a bound parameter, never as SQL text. "${input}" matches literally — a parameterized query can still return rows when the value is correct.`
        : `The input is a bound parameter, not SQL text. The database searches for a literal name "${input}" — 0 rows.`,
    };
  }

  const sql = `SELECT * FROM users WHERE user = '${input}' AND pass = 'secret'`;
  const lower = input.toLowerCase();

  // Sem metacaracteres: busca literal, resultado coerente.
  if (!SQL_META.test(input)) {
    const rows = SQL_DEMO_USERS.filter((u) => u === input);
    return {
      supported: true,
      mode: "concat",
      sql,
      rows,
      tokens,
      verdict: rows.length
        ? `Plain text: the query matches "${input}" literally and returns it.`
        : `Plain text: no user named "${input}" — 0 rows. Concatenation is not dangerous on this input, but the door is open.`,
    };
  }

  // Payload clássico OR '1'='1' — com e sem comentário.
  if (/or\s*'1'\s*=\s*'1/.test(lower)) {
    const commented = lower.includes("--");
    return {
      supported: true,
      mode: "concat",
      sql,
      rows: commented ? [...SQL_DEMO_USERS] : [...SQL_DEMO_USERS],
      tokens,
      precedence:
        "SQL precedence: AND binds before OR, so the clause reads user='x' OR ('1'='1' AND pass='secret'). The password check is still part of the expression — it only passes here because the template hardcodes pass='secret'.",
      verdict: commented
        ? "The '--' comment swallows everything after the injection point, removing the password clause entirely. The WHERE clause becomes user='' OR '1'='1' — always true — so every user is returned."
        : "The injection injects an OR condition. The password clause still participates (see precedence), but since the template hardcodes pass='secret' the expression is satisfied and every user is returned. A variant with a '--' comment is the reliable bypass because it removes the clause entirely.",
    };
  }

  // Encadeamento de statement.
  if (lower.includes("drop table") || lower.includes(";")) {
    return {
      supported: true,
      mode: "concat",
      sql,
      rows: [],
      tokens,
      verdict:
        "Statement chaining: the ';' ends the SELECT and starts a new statement (e.g. DROP TABLE). In this teaching model nothing is actually executed — real drivers often reject multiple statements, which is one of the mitigations, alongside parameterized queries and least privilege.",
    };
  }

  // Qualquer outra entrada: fora do modelo (D12) — nunca veredito inventado.
  return {
    supported: false,
    mode: "concat",
    sql,
    rows: [],
    tokens,
    verdict:
      "This input is outside the model. Here is the mechanism to reason with: the server concatenates your text into the WHERE clause, so every quote/keyword you type rewrites the query itself. Try the payloads shown above.",
  };
}

// ---------- S5 · Pub/Sub + queue: competing consumers vs fan-out (spec 4.2) ----------

export type QueueMode = "competing" | "fanout";
export type FailureKind = "transient" | "poison" | "slow";

export interface QueueEvent {
  id: number;
  payload: string;
  attempts: number;
}

export interface QueueStepResult {
  processed: number;
  dead: number;
  queueDepth: number;
  outcome: "processed" | "retry" | "dead" | "idle";
  worker: number;
  event?: QueueEvent;
}

export interface QueueDelivery {
  eventId: number;
  payload: string;
  subscriber: number;
  state: "pending" | "acked" | "dead";
  attempts: number;
}

export interface QueueController {
  publish(payload: string): QueueEvent;
  step(): QueueStepResult;
  snapshot(): { queueDepth: number; processed: number; dead: number };
  setFlaky(worker: number | null): void;
  reset(): void;
  /** Apenas fan-out: entregas por assinante (spec 4.2). */
  deliveries(): QueueDelivery[];
}

const FLAKY_FAIL_P = 0.75;

export function createPubSubQueue(
  opts: {
    mode?: QueueMode;
    workers?: number;
    flakyWorker?: number | null;
    failure?: FailureKind;
    maxAttempts?: number;
    rng?: () => number;
  } = {},
): QueueController {
  const mode = opts.mode ?? "competing";
  const failure = opts.failure ?? "transient";
  const workers = opts.workers ?? 3;
  const maxAttempts = opts.maxAttempts ?? 3;
  const rng = opts.rng ?? Math.random;
  let flakyWorker = opts.flakyWorker ?? null;
  let queue: QueueEvent[] = [];
  let deliveries: QueueDelivery[] = [];
  let nextId = 1;
  let processed = 0;
  let dead = 0;
  let cursor = 0;
  let slowCounter = 0;

  return {
    publish(payload: string): QueueEvent {
      const event = { id: nextId++, payload, attempts: 0 };
      if (mode === "fanout") {
        for (let s = 0; s < workers; s++) {
          deliveries.push({
            eventId: event.id,
            payload,
            subscriber: s,
            state: "pending",
            attempts: 0,
          });
        }
      } else {
        queue.push(event);
      }
      return event;
    },

    step(): QueueStepResult {
      if (mode === "fanout") {
        return fanoutStep();
      }
      if (failure === "slow") {
        // Consumidor lento: processa 1 evento a cada 2 steps; nunca falha,
        // nunca vai para DLQ — só acumula (spec 4.2d).
        slowCounter++;
        const depth = queue.length;
        if (slowCounter % 2 === 0 && depth > 0) {
          const event = queue.shift()!;
          processed++;
          cursor++;
          return { processed, dead, queueDepth: queue.length, outcome: "processed", worker: cursor % workers, event };
        }
        return { processed, dead, queueDepth: depth, outcome: "idle", worker: cursor % workers };
      }

      const event = queue[0];
      if (!event) {
        return {
          processed,
          dead,
          queueDepth: 0,
          outcome: "idle",
          worker: cursor % workers,
        };
      }
      const worker = cursor % workers;

      // Causas de falha separadas (spec 4.2):
      // - poison: retry não ajuda; esgota → DLQ.
      // - transient: retry no MESMO worker pode resolver (rng injetável).
      let failed: boolean;
      if (failure === "poison") {
        failed = true;
      } else {
        failed = worker === flakyWorker && rng() < FLAKY_FAIL_P;
      }

      if (!failed) {
        queue.shift();
        processed++;
        cursor++;
        return { processed, dead, queueDepth: queue.length, outcome: "processed", worker, event };
      }
      event.attempts++;
      if (event.attempts >= maxAttempts) {
        queue.shift();
        dead++;
        cursor++;
        return { processed, dead, queueDepth: queue.length, outcome: "dead", worker, event };
      }
      // Falhou: o mesmo worker tenta de novo no próximo passo (retry real).
      return { processed, dead, queueDepth: queue.length, outcome: "retry", worker, event };
    },

    snapshot() {
      if (mode === "fanout") {
        return {
          queueDepth: deliveries.filter((d) => d.state === "pending").length,
          processed,
          dead,
        };
      }
      return { queueDepth: queue.length, processed, dead };
    },

    setFlaky(worker: number | null) {
      flakyWorker = worker;
    },

    reset() {
      queue = [];
      deliveries = [];
      processed = 0;
      dead = 0;
      cursor = 0;
      slowCounter = 0;
    },

    deliveries() {
      return [...deliveries];
    },
  };

  function fanoutStep(): QueueStepResult {
    // Consumidor lento em fan-out: cada assinante processa 1 entrega a cada
    // 2 steps; nada vai para DLQ (spec 4.2d).
    if (failure === "slow") {
      slowCounter++;
      const depth = deliveries.filter((d) => d.state === "pending").length;
      if (slowCounter % 2 === 0 && depth > 0) {
        const target = deliveries.find((d) => d.state === "pending");
        if (target) {
          target.state = "acked";
          processed++;
        }
      }
      return { processed, dead, queueDepth: deliveries.filter((d) => d.state === "pending").length, outcome: "idle", worker: cursor % workers };
    }

    // Round-robin por assinante: encontra a próxima entrega pendente a partir
    // do cursor (retry fica no MESMO assinante).
    for (let i = 0; i < workers; i++) {
      const s = (cursor + i) % workers;
      const target = deliveries.find((d) => d.state === "pending" && d.subscriber === s);
      if (!target) continue;

      let failed: boolean;
      if (failure === "poison") {
        failed = true;
      } else {
        failed = s === flakyWorker && rng() < FLAKY_FAIL_P;
      }

      if (!failed) {
        target.state = "acked";
        processed++;
        cursor = (s + 1) % workers;
        return {
          processed,
          dead,
          queueDepth: deliveries.filter((d) => d.state === "pending").length,
          outcome: "processed",
          worker: s,
          event: { id: target.eventId, payload: target.payload, attempts: target.attempts },
        };
      }
      target.attempts++;
      if (target.attempts >= maxAttempts) {
        target.state = "dead";
        dead++;
        cursor = (s + 1) % workers;
        return {
          processed,
          dead,
          queueDepth: deliveries.filter((d) => d.state === "pending").length,
          outcome: "dead",
          worker: s,
          event: { id: target.eventId, payload: target.payload, attempts: target.attempts },
        };
      }
      // Retry no mesmo assinante: cursor não avança.
      return {
        processed,
        dead,
        queueDepth: deliveries.filter((d) => d.state === "pending").length,
        outcome: "retry",
        worker: s,
        event: { id: target.eventId, payload: target.payload, attempts: target.attempts },
      };
    }

    return {
      processed,
      dead,
      queueDepth: 0,
      outcome: "idle",
      worker: cursor % workers,
    };
  }
}

// ---------- S6 · Distribuição de latência (P99/tail, spec 4.4) ----------

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Distribuição de longa-tail determinística (ms). GARANTIA do modelo (spec
 * 4.4): exatamente 1 cauda singular por amostra de 100 — a legenda descreve
 * só o que o modelo garante.
 */
export function simulateLatencies(n: number, seed: number): number[] {
  const rand = mulberry32(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const isForcedTail = i === n - 1; // 1 cauda garantida por amostra
    const r = rand();
    let ms: number;
    if (isForcedTail) {
      ms = 7000 + rand() * 3500;
    } else if (r > 0.95) {
      ms = 1800 + rand() * 1500;
    } else {
      ms = 550 + rand() * 550;
    }
    out.push(Math.round(ms));
  }
  return out;
}

/** Percentil sobre array já ordenado (asc). Convenção: nearest-rank. */
export function percentile(sortedMs: number[], p: number): number {
  if (sortedMs.length === 0) return 0;
  const idx = Math.min(
    sortedMs.length - 1,
    Math.max(0, Math.ceil((p / 100) * sortedMs.length) - 1),
  );
  return sortedMs[idx] ?? 0;
}

/** Exemplo obrigatório da bancada (spec 4.4): 99×100 ms + 1×10.000 ms. */
export const P99_NEAREST_RANK_EXAMPLE = {
  sample: [...Array<number>(99).fill(100), 10_000],
  p99: 100,
  max: 10_000,
  mean: 199,
  convention: "nearest-rank" as const,
};
