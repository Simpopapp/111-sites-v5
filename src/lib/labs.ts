import { percentile, simulateLatencies, type SandboxId } from "@/lib/simulators";
import type { RequestFlowData, StateMachineData, HistogramData } from "@/components/instruments";

/**
 * Bancada completa dos 6 laboratórios focados (PRD project2 F3 / s4-bancadas).
 * Estrutura por bancada: cenário → controles → representação → evidência →
 * interpretação → desafio. Dados dos instrumentos seguem os contratos D6
 * (seção 15 do PRD); são material de ilustração inicial, rotulado como tal.
 */
export interface LabBench {
  id: SandboxId;
  title: string;
  scenario: { system: string; data: string; symptom: string; baseline: string };
  instrument: {
    kind: "request-flow" | "state-machine" | "latency-histogram";
    data: RequestFlowData | StateMachineData | HistogramData;
    caption: string;
    textEquivalent: string;
  };
  /** O que o aluno deve conseguir apontar antes de ler a resposta. */
  evidence: string[];
  interpretation: string;
  challenge: string;
}

const tailSample = [...simulateLatencies(100, 42)].sort((a, b) => a - b);

function binsFor(sample: number[]): HistogramData["bins"] {
  const edges = [400, 800, 1200, 2000, 4000, 11000];
  const bins: HistogramData["bins"] = [];
  for (let i = 0; i < edges.length - 1; i++) {
    bins.push({
      from: edges[i]!,
      to: edges[i + 1]!,
      count: sample.filter((v) => v >= edges[i]! && v < edges[i + 1]!).length,
    });
  }
  return bins;
}

export const LABS: Record<SandboxId, LabBench> = {
  ratelimit: {
    id: "ratelimit",
    title: "Rate Limiting",
    scenario: {
      system: "Public API behind an edge gateway, one limiter instance per IP.",
      data: "Token bucket: capacity 5, refill 1 token every 1.5 s, scoped per IP.",
      symptom: "A burst of clicks is fine; a sustained loop of retries gets 429s.",
      baseline: "With tokens available, every request is accepted and forwarded.",
    },
    instrument: {
      kind: "request-flow",
      caption:
        "Observe where each request went: consumed a token and reached the service, or was rejected at the edge with a 429.",
      data: {
        nodes: [
          { id: "client", label: "Client", kind: "client" },
          { id: "edge", label: "Rate limiter (edge)", kind: "edge" },
          { id: "service", label: "API service", kind: "service" },
          { id: "store", label: "Database", kind: "store" },
        ],
        edges: [
          { from: "client", to: "edge", label: "GET /api/v1/data" },
          { from: "edge", to: "service", label: "forward — 1 token consumed" },
          { from: "edge", to: "client", label: "429 Too Many Requests" },
        ],
        window: [
          { ts: "12:00:00.000", accepted: 1, rejected: 0, destination: "service" },
          { ts: "12:00:00.120", accepted: 1, rejected: 0, destination: "service" },
          { ts: "12:00:00.260", accepted: 1, rejected: 1, destination: "client" },
          { ts: "12:00:00.400", accepted: 0, rejected: 2, destination: "client" },
        ],
        limits: [{ kind: "token-bucket", capacity: 5, refillMs: 1500, scope: "ip" }],
      },
      textEquivalent:
        "4 requests in 400 ms: 3 accepted and forwarded to the service, 2 rejected with 429 at the edge. Limit: token bucket, capacity 5, refill 1/1.5 s, scoped per IP.",
    },
    evidence: [
      "Point at the moment the 429s start and name what ran out (tokens, not requests).",
      "Distinguish an acceptable burst (tokens cover it) from a sustained flow the bucket cannot refill for.",
    ],
    interpretation:
      "The limiter does not count requests — it counts tokens. A burst within capacity passes; a flow faster than the refill rate drains the bucket and gets 429s. The scope decides who is being limited: per-IP here means one noisy client does not starve the others.",
    challenge:
      "The same traffic rate moved to a global (shared) limit: who gets throttled now, and why does that change who is hurt?",
  },
  circuit: {
    id: "circuit",
    title: "Circuit Breaker",
    scenario: {
      system: "Checkout service calling a slow downstream payment provider.",
      data: "Breaker: opens after 3 consecutive failures, 5 s cooldown, 1 half-open probe.",
      symptom: "Every call waits for the full timeout while the provider is down.",
      baseline: "In CLOSED the breaker is invisible; requests flow normally.",
    },
    instrument: {
      kind: "state-machine",
      caption:
        "Follow the states and name the trigger of each transition — nothing changes state without an explicit cause.",
      data: {
        states: [
          { id: "closed", label: "CLOSED — normal calls", tone: "ok" },
          { id: "open", label: "OPEN — failing fast", tone: "down" },
          { id: "half-open", label: "HALF-OPEN — probing", tone: "warn" },
        ],
        transitions: [
          { from: "closed", to: "open", trigger: "3 consecutive failures" },
          { from: "open", to: "half-open", trigger: "cooldown elapsed (5 s)" },
          { from: "half-open", to: "closed", trigger: "probe succeeds" },
          { from: "half-open", to: "open", trigger: "probe fails" },
        ],
        now: "closed",
        history: [
          { ts: 0, event: "call succeeded", from: "closed" },
          { ts: 1, event: "failure 1/3", from: "closed" },
          { ts: 2, event: "failure 2/3", from: "closed" },
          { ts: 3, event: "failure 3/3 → OPEN", from: "closed", to: "open" },
        ],
        budget: { label: "cooldown", ms: 5000 },
      },
      textEquivalent:
        "States: CLOSED (normal), OPEN (failing fast), HALF-OPEN (probing). Transitions: 3 consecutive failures → OPEN; cooldown 5 s elapsed → HALF-OPEN; probe succeeds → CLOSED; probe fails → OPEN again.",
    },
    evidence: [
      "Name the trigger of every transition on the bench (3 failures, cooldown, probe result).",
      "Explain what the caller experiences in OPEN versus CLOSED.",
    ],
    interpretation:
      "The breaker trades waiting for a fast, known failure. In OPEN the caller gets an immediate error instead of a 10 s timeout — that protects the caller's threads and gives the downstream time to recover. HALF-OPEN is the controlled experiment: exactly one probe decides whether to close again.",
    challenge:
      "Why does one successful probe close the breaker instead of, say, five? What does that choice assume about the downstream?",
  },
  nplusone: {
    id: "nplusone",
    title: "N+1 Visualizer",
    scenario: {
      system: "User list page that loads addresses one item at a time.",
      data: "Users configurable (10/25/50), cardinality 1/2/5 addresses per user, cost per round-trip configurable.",
      symptom: "Page feels slower as the list grows — latency scales with rows, not pages.",
      baseline: "One JOIN: 1 round-trip regardless of list size.",
    },
    instrument: {
      kind: "request-flow",
      caption:
        "Count the round-trips to the store under each strategy. Same data, different query shape.",
      data: {
        nodes: [
          { id: "client", label: "Browser", kind: "client" },
          { id: "app", label: "App server", kind: "service" },
          { id: "db", label: "Database", kind: "store" },
        ],
        edges: [
          { from: "client", to: "app", label: "GET /users" },
          { from: "app", to: "db", label: "1 query per item (N+1)" },
          { from: "app", to: "db", label: "or 1 JOIN for everything" },
        ],
        window: [
          { ts: "12:00:01.000", accepted: 1, rejected: 0, destination: "db — users" },
          { ts: "12:00:01.010", accepted: 25, rejected: 0, destination: "db — one per user" },
        ],
      },
      textEquivalent:
        "Per-item: 1 + N queries to the database. Batch: queries grouped by IN (...). JOIN: a single query returns users with their addresses. Latency follows round-trips × cost, labeled as a teaching model.",
    },
    evidence: [
      "Show that per-item runs users+1 queries for every cardinality.",
      "Show that batch and JOIN cut the count without touching the data.",
    ],
    interpretation:
      "The dominant cost is round-trips, not rows — that is why fewer queries wins. But 'fewer queries' is not automatically 'faster': a JOIN on a page the UI discards, or a batch IN () list so large it defeats indexes, can be worse. Separate the two claims.",
    challenge:
      "With cardinality 5 and 50 users, which strategy wins if each round-trip costs 2 ms instead of 12 ms? When does the answer flip?",
  },
  sqli: {
    id: "sqli",
    title: "SQL Injection",
    scenario: {
      system: "Login form that builds SQL from raw user input.",
      data: "Fixed demo table: alice, O'Brien, bob, carol — password check inline.",
      symptom: "A crafted username returns every user without the password.",
      baseline: "Parameterized mode treats the input as one opaque value.",
    },
    instrument: {
      kind: "request-flow",
      caption:
        "Watch the input change role: data in parameterized mode, code in concatenation mode.",
      data: {
        nodes: [
          { id: "client", label: "Login form", kind: "client" },
          { id: "app", label: "App server", kind: "service" },
          { id: "db", label: "Database", kind: "store" },
        ],
        edges: [
          { from: "client", to: "app", label: "username field" },
          { from: "app", to: "db", label: "concatenated SQL (code)" },
          { from: "app", to: "db", label: "bound parameter (data)" },
        ],
        window: [
          { ts: "12:00:01.000", accepted: 1, rejected: 0, destination: "db — literal search" },
          { ts: "12:00:01.050", accepted: 1, rejected: 0, destination: "db — bypass" },
        ],
      },
      textEquivalent:
        "Two paths to the database: concatenation puts user text inside the SQL text (code) and lets quotes rewrite the clause; parameterization ships the same text as a value (data). Inputs outside the model get 'outside the model', not a fake verdict.",
    },
    evidence: [
      "Explain the precedence reading of user='x' OR '1'='1' AND pass='secret' (AND binds first).",
      "Show that parameterized mode can still return rows — when the value is literally correct.",
    ],
    interpretation:
      "Injection is a quoting bug: the boundary between code and data disappears. Parameterized queries restore it — the value is transmitted as data, never parsed as SQL. Note the honest semantics: a correct parameterized query CAN log you in (that is its job); it just cannot be tricked into changing the query.",
    challenge:
      "Why is the '--' comment variant the reliable bypass while the bare OR payload depends on how the rest of the clause was written?",
  },
  pubsub: {
    id: "pubsub",
    title: "Pub/Sub + Queue",
    scenario: {
      system: "Order events published to a queue consumed by N workers (or fanned out to subscribers).",
      data: "Competing consumers share one queue; fan-out gives every subscriber its own delivery. Failure kinds: transient, poison, slow.",
      symptom: "Confusing 'one worker got it' with 'everyone got it' — and blaming the message for a flaky worker.",
      baseline: "Healthy workers ack every delivery; DLQ only after retries exhaust.",
    },
    instrument: {
      kind: "request-flow",
      caption:
        "In competing mode one worker wins each event; in fan-out every subscriber gets its own copy and its own failure.",
      data: {
        nodes: [
          { id: "pub", label: "Publisher", kind: "service" },
          { id: "queue", label: "Queue / exchange", kind: "edge" },
          { id: "w0", label: "Worker A", kind: "service" },
          { id: "w1", label: "Worker B", kind: "service" },
          { id: "w2", label: "Worker C", kind: "service" },
          { id: "dlq", label: "Dead Letter Queue", kind: "store" },
        ],
        edges: [
          { from: "pub", to: "queue", label: "publish" },
          { from: "queue", to: "w0", label: "competing: one wins" },
          { from: "queue", to: "w1", label: "fan-out: every subscriber" },
          { from: "w0", to: "dlq", label: "3 failed attempts" },
        ],
        window: [
          { ts: "12:00:01.000", accepted: 1, rejected: 0, destination: "worker A" },
          { ts: "12:00:01.200", accepted: 0, rejected: 1, destination: "DLQ — poison" },
        ],
      },
      textEquivalent:
        "Competing consumers: N workers share one queue, each event is processed once. Fan-out: every subscriber receives every event, failures are per subscriber. Failure causes: transient (retry helps), poison (retry does not help → DLQ), slow consumer (queue accumulates, no DLQ).",
    },
    evidence: [
      "Switch modes and state who receives each event (one worker vs every subscriber).",
      "Classify a failure: transient, poison, or slow — and what retry does in each.",
    ],
    interpretation:
      "The delivery model decides semantics: competing consumers give work distribution, fan-out gives independent copies. 'Poison' is a property of the message, never of a flaky worker — a random failure that succeeds on retry was transient, and retrying it is correct. A slow consumer accumulates backlog; that is backpressure, not dead letters.",
    challenge:
      "An event fails 3 times in a row and lands in the DLQ. What experiment would you run to decide whether it was poison or an unlucky transient streak?",
  },
  tail: {
    id: "tail",
    title: "P99 & Tail Latency",
    scenario: {
      system: "Service returning 100 request timings per run.",
      data: "Teaching model with a guaranteed single tail observation per 100 requests.",
      symptom: "The average looks fine; the slowest 1% of users wait 10× longer.",
      baseline: "Distribution, not a single number, describes latency.",
    },
    instrument: {
      kind: "latency-histogram",
      caption:
        "Read the distribution: where most requests land, and where the percentile markers fall.",
      data: {
        unit: "ms",
        bins: binsFor(tailSample),
        sample: tailSample,
        markers: [
          { label: "P50", value: percentile(tailSample, 50), convention: "nearest-rank" },
          { label: "P99", value: percentile(tailSample, 99), convention: "nearest-rank" },
        ],
        note: "Teaching model, not a benchmark: exactly 1 tail observation per 100 is guaranteed. With 100 samples, P99.9 is fragile for inferring the population.",
      },
      textEquivalent:
        "Histogram of 100 request timings in ms: most under ~1.1 s, a few 1.8–3.3 s, exactly one 7–10.5 s tail. Markers: P50 and P99 by nearest rank. The model guarantees exactly one tail observation per 100 samples.",
    },
    evidence: [
      "Read P99 off the histogram and say which observation determines it (nearest rank).",
      "Explain the example 99×100 ms + 1×10,000 ms → P99 = 100 ms while max = 10,000 ms.",
    ],
    interpretation:
      "Percentiles are computed over the distribution: P99 is the 99th value of the sorted sample (nearest rank). The classic example shows why averages mislead — mean 199 ms, but the unlucky request waited 10,000 ms. And with only 100 samples, P99 itself is one observation: fragile for claiming population properties.",
    challenge:
      "Your fix improves the mean by 30% but P99 is unchanged. Which metric answers the user's complaint 'the page sometimes hangs for 10 seconds'?",
  },
};
