import { describe, expect, it } from "vitest";
import {
  createCircuitBreaker,
  createPubSubQueue,
  createTokenBucket,
  evaluateSqlInjection,
  getRelatedSandbox,
  getRelatedSandboxLink,
  P99_NEAREST_RANK_EXAMPLE,
  percentile,
  SANDBOXES,
  simulateLatencies,
  simulateQueries,
} from "@/lib/simulators";

// Gate G6 (PRD §10) + specs de precisão 4.1–4.5 (PRD project2 §4).
describe("token bucket", () => {
  it("consumes until empty, then throttles with 429", () => {
    let t = 0;
    const bucket = createTokenBucket({ capacity: 5, refillIntervalMs: 1500, now: () => t });
    for (let i = 0; i < 5; i++) expect(bucket.tryConsume().ok).toBe(true);
    expect(bucket.tryConsume().ok).toBe(false); // 429
  });

  it("refills one token per interval, capped at capacity", () => {
    let t = 0;
    const bucket = createTokenBucket({ capacity: 5, refillIntervalMs: 1500, now: () => t });
    for (let i = 0; i < 5; i++) bucket.tryConsume();
    t = 1500; // 1 intervalo
    expect(bucket.tryConsume().ok).toBe(true);
    expect(bucket.tryConsume().ok).toBe(false);
    t += 1500 * 10; // muito tempo depois: volta ao máximo, sem estourar
    expect(bucket.tokens()).toBe(5);
  });
});

describe("circuit breaker", () => {
  it("trips OPEN after the threshold of consecutive failures", () => {
    let t = 0;
    const cb = createCircuitBreaker({ threshold: 3, cooldownMs: 5000, now: () => t });
    cb.record(false);
    cb.record(false);
    expect(cb.record(false).state).toBe("open");
    expect(cb.record(true).blocked).toBe(true); // fail fast
  });

  it("goes HALF-OPEN after the cooldown, then closes on probe success", () => {
    let t = 0;
    const cb = createCircuitBreaker({ threshold: 2, cooldownMs: 5000, now: () => t });
    cb.record(false);
    expect(cb.record(false).state).toBe("open");
    t = 4999;
    expect(cb.state()).toBe("open");
    t = 5000;
    expect(cb.state()).toBe("half-open");
    expect(cb.record(true).state).toBe("closed");
  });

  it("re-opens immediately when the half-open probe fails", () => {
    let t = 0;
    const cb = createCircuitBreaker({ threshold: 1, cooldownMs: 1000, now: () => t });
    cb.record(false);
    t = 1000;
    expect(cb.state()).toBe("half-open");
    expect(cb.record(false).state).toBe("open");
  });
});

describe("N+1 — por-item, lote e JOIN (spec 4.3)", () => {
  it("per-item runs users+1 queries, whatever the cardinality", () => {
    for (const users of [10, 25, 50]) {
      for (const cardinality of [1, 2, 5] as const) {
        expect(
          simulateQueries({ users, cardinality, roundTripMs: 12, strategy: "per-item" }).count,
        ).toBe(users + 1);
      }
    }
  });

  it("batch and JOIN reduce the count regardless of cardinality", () => {
    for (const cardinality of [1, 2, 5] as const) {
      expect(
        simulateQueries({ users: 25, cardinality, roundTripMs: 12, strategy: "batch" }).count,
      ).toBe(1);
      expect(
        simulateQueries({ users: 25, cardinality, roundTripMs: 12, strategy: "join" }).count,
      ).toBe(1);
    }
  });

  it("latency respects the displayed formula and labels the model", () => {
    const res = simulateQueries({ users: 25, cardinality: 2, roundTripMs: 12, strategy: "per-item" });
    expect(res.latencyMs).toBe(res.count * 12 + res.rows * 1);
    expect(res.rows).toBe(50);
    expect(res.formula).toContain("not a benchmark");
  });
});

describe("SQL injection — semântica coerente (spec 4.1)", () => {
  it("classic payload without comment: bypass with correct precedence explanation", () => {
    const res = evaluateSqlInjection("x' OR '1'='1", "concat");
    expect(res.supported).toBe(true);
    expect(res.rows).toHaveLength(4);
    expect(res.precedence).toContain("AND binds before OR");
    expect(res.verdict).toContain("comment");
  });

  it("payload with -- comments out the password clause", () => {
    const res = evaluateSqlInjection("x' OR '1'='1' --", "concat");
    expect(res.supported).toBe(true);
    expect(res.rows).toHaveLength(4);
    expect(res.verdict).toContain("--");
  });

  it("DROP TABLE chaining is explained, not faked as executed", () => {
    const res = evaluateSqlInjection("'; DROP TABLE users --", "concat");
    expect(res.supported).toBe(true);
    expect(res.rows).toEqual([]);
    expect(res.verdict).toContain("Statement chaining");
    expect(res.verdict).toContain("nothing is actually executed");
  });

  it("unknown metacharacter input is out of the model, never a fake verdict", () => {
    const res = evaluateSqlInjection("zzz' --", "concat");
    expect(res.supported).toBe(false);
    expect(res.verdict).toContain("outside the model");
  });

  it("plain input does a literal search (0 or 1 row, coherent)", () => {
    expect(evaluateSqlInjection("alice", "concat").rows).toEqual(["alice"]);
    expect(evaluateSqlInjection("nobody", "concat").rows).toEqual([]);
  });

  it("parameterized matches literals, including O'Brien", () => {
    const ob = evaluateSqlInjection("O'Brien", "parameterized");
    expect(ob.rows).toEqual(["O'Brien"]);
    expect(evaluateSqlInjection("' OR '1'='1", "parameterized").rows).toEqual([]);
    expect(evaluateSqlInjection("' OR '1'='1", "parameterized").sql).toContain("$1");
  });
});

describe("pub/sub — competing consumers (comportamento do Project 1 preservado)", () => {
  it("delivers to healthy workers", () => {
    const q = createPubSubQueue({ flakyWorker: null });
    q.publish("order:1");
    expect(q.step().outcome).toBe("processed");
  });

  it("keeps the event at the front while the same worker retries it", () => {
    const q = createPubSubQueue({
      workers: 2,
      flakyWorker: 0,
      maxAttempts: 3,
      rng: () => 0, // sempre falha (falha é rng() < 0.75)
    });
    q.publish("a");
    q.publish("b");
    const r1 = q.step(); // worker 0 falha (tentativa 1)
    expect(r1.outcome).toBe("retry");
    expect(q.snapshot().queueDepth).toBe(2);
    const r2 = q.step(); // o MESMO worker tenta de novo
    expect(r2.worker).toBe(0);
    expect(r2.event?.attempts).toBe(2);
    const r3 = q.step(); // 3ª falha → DLQ
    expect(r3.outcome).toBe("dead");
    expect(q.snapshot().dead).toBe(1);
    const r4 = q.step(); // cursor avança → worker saudável processa "b"
    expect(r4.outcome).toBe("processed");
    expect(r4.worker).toBe(1);
    expect(r4.event?.payload).toBe("b");
  });

  it("eventually processes an event whose retries hit a healthy attempt", () => {
    // rng: primeira chamada falha (1), segunda processa (0)
    let call = 0;
    const q = createPubSubQueue({ workers: 1, flakyWorker: 0, rng: () => (call++ === 0 ? 0.5 : 0.9) }); // 1ª tentativa falha, 2ª passa
    q.publish("flaky-once");
    expect(q.step().outcome).toBe("retry");
    expect(q.step().outcome).toBe("processed");
    expect(q.snapshot().dead).toBe(0);
  });
});

describe("pub/sub — dois modos e três causas de falha (spec 4.2)", () => {
  it("(a) fan-out delivers the same event to every subscriber", () => {
    const q = createPubSubQueue({ mode: "fanout", workers: 2, flakyWorker: null });
    q.publish("e1");
    expect(q.step().outcome).toBe("processed");
    expect(q.step().outcome).toBe("processed");
    const ds = q.deliveries();
    expect(ds).toHaveLength(2);
    expect(ds.every((d) => d.state === "acked" && d.payload === "e1")).toBe(true);
    expect(q.snapshot().processed).toBe(2);
    expect(q.snapshot().dead).toBe(0);
  });

  it("(b) transient failure + successful retry never reaches the DLQ", () => {
    const q = createPubSubQueue({ mode: "fanout", workers: 1, flakyWorker: 0, failure: "transient", rng: () => (0) }); // flaky sempre falha
    q.publish("e");
    expect(q.step().outcome).toBe("retry");
    q.setFlaky(null); // próxima tentativa tem sucesso
    expect(q.step().outcome).toBe("processed");
    expect(q.snapshot().dead).toBe(0);
  });

  it("(c) poison exhausts retries and lands in the DLQ (retry does not help)", () => {
    const q = createPubSubQueue({ workers: 1, failure: "poison", maxAttempts: 3 });
    q.publish("bad");
    expect(q.step().outcome).toBe("retry");
    expect(q.step().outcome).toBe("retry");
    expect(q.step().outcome).toBe("dead");
    expect(q.snapshot().dead).toBe(1);
  });

  it("(d) slow consumer accumulates the queue without incrementing the DLQ", () => {
    const q = createPubSubQueue({ workers: 1, failure: "slow" });
    q.publish("a");
    q.publish("b");
    q.publish("c");
    expect(q.step().outcome).toBe("idle"); // consumidor lento: ainda processando
    expect(q.snapshot().queueDepth).toBe(3);
    expect(q.step().outcome).toBe("processed"); // 2º step processa 1
    expect(q.snapshot().dead).toBe(0);
    for (let i = 0; i < 10; i++) q.step();
    expect(q.snapshot().dead).toBe(0);
  });

  it("poison in fan-out dead-letters only the affected delivery", () => {
    const q = createPubSubQueue({ mode: "fanout", workers: 2, failure: "poison", maxAttempts: 2 });
    q.publish("bad");
    expect(q.step().outcome).toBe("retry"); // assinante 0, tentativa 1
    expect(q.step().outcome).toBe("dead"); // assinante 0 esgota
    expect(q.step().outcome).toBe("retry"); // assinante 1, tentativa 1
    expect(q.step().outcome).toBe("dead"); // assinante 1 esgota
    expect(q.deliveries().every((d) => d.state === "dead")).toBe(true);
    expect(q.snapshot().dead).toBe(2);
  });
});

describe("P99 — rigor nearest-rank (spec 4.4)", () => {
  it("example 99×100ms + 1×10,000ms → P99=100, max=10,000, mean=199", () => {
    const sorted = [...P99_NEAREST_RANK_EXAMPLE.sample].sort((a, b) => a - b);
    expect(percentile(sorted, 99)).toBe(100);
    expect(sorted[sorted.length - 1]).toBe(10_000);
    const mean = Math.round(sorted.reduce((a, b) => a + b, 0) / sorted.length);
    expect(mean).toBe(199);
    expect(P99_NEAREST_RANK_EXAMPLE.p99).toBe(100);
    expect(P99_NEAREST_RANK_EXAMPLE.max).toBe(10_000);
    expect(P99_NEAREST_RANK_EXAMPLE.mean).toBe(199);
    expect(P99_NEAREST_RANK_EXAMPLE.convention).toBe("nearest-rank");
  });

  it("is deterministic for the same seed", () => {
    expect(simulateLatencies(100, 42)).toEqual(simulateLatencies(100, 42));
  });

  it("guarantees exactly 1 tail observation per 100 samples", () => {
    for (const seed of [1, 7, 42, 99]) {
      const sample = simulateLatencies(100, seed);
      const tails = sample.filter((v) => v >= 6000).length;
      expect(tails, `seed ${seed}`).toBe(1);
    }
  });

  it("shows a long tail: p99 well above p50", () => {
    const sorted = [...simulateLatencies(100, 7)].sort((a, b) => a - b);
    const p50 = percentile(sorted, 50);
    const p99 = percentile(sorted, 99);
    expect(p50).toBeGreaterThanOrEqual(550);
    expect(p50).toBeLessThan(1200);
    expect(p99).toBeGreaterThan(p50 * 2);
  });

  it("computes the max as the worst request", () => {
    const sorted = [...simulateLatencies(100, 9)].sort((a, b) => a - b);
    expect(percentile(sorted, 100)).toBe(sorted[sorted.length - 1]);
  });
});

describe("sandbox registry", () => {
  it("has exactly 6 sandboxes with linked concepts", () => {
    expect(SANDBOXES).toHaveLength(6);
    for (const s of SANDBOXES) expect(s.conceptIds.length).toBeGreaterThan(0);
  });

  it("maps concepts to their sandboxes", () => {
    expect(getRelatedSandbox(1)?.id).toBe("ratelimit");
    expect(getRelatedSandbox(10)?.id).toBe("circuit");
    expect(getRelatedSandbox(78)?.id).toBe("sqli");
    expect(getRelatedSandbox(111)).toBeUndefined();
  });

  it("types the links: out-of-scope concepts are context, not direct (spec 4.5)", () => {
    expect(getRelatedSandboxLink(13)).toMatchObject({ kind: "context", sandbox: "ratelimit" });
    expect(getRelatedSandboxLink(74)).toMatchObject({ kind: "context", sandbox: "sqli" });
    expect(getRelatedSandboxLink(79)).toMatchObject({ kind: "context", sandbox: "sqli" });
    expect(getRelatedSandboxLink(13)?.note).toContain("not backoff");
    // context links não aparecem como laboratório direto
    expect(getRelatedSandbox(13)).toBeUndefined();
    expect(getRelatedSandbox(74)).toBeUndefined();
  });
});
