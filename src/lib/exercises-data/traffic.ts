import type { Task } from "@/lib/exercises";

// Tarefas de prática âncora de Traffic (PRD project2 D8 / pacote s3-exercicios).
export const TASKS_TRAFFIC: Task[] = [
  {
    id: "t-1-predict",
    conceptId: 1,
    type: "predict",
    prompt:
      "Before running the replay, predict how many requests the limiter admits. Choose one.",
    context:
      "A shared token bucket for one API key has capacity 6 and currently contains 6 tokens. It refills at 2 tokens per second. At t=0, ten requests arrive simultaneously; at t=1 second, three more arrive simultaneously. Each admitted request consumes one token. There are no other requests, no queue, and bucket updates are atomic.",
    options: [
      { key: "a", label: "6 at t=0; 0 at t=1." },
      { key: "b", label: "6 at t=0; 2 at t=1." },
      { key: "c", label: "6 at t=0; 3 at t=1." },
      { key: "d", label: "2 at t=0; 2 at t=1." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-bucket",
          label: "Apply both burst capacity and elapsed-time refill.",
          cause:
            "The prediction treats the refill rate as either a per-batch allowance or the initial burst limit, instead of tracking the bucket's remaining tokens.",
          check: (a) => a.picked?.length === 1 && a.picked[0] === "b",
        },
      ],
      expected:
        "The first burst consumes all 6 existing tokens, so 4 requests are rejected. One second adds 2 tokens; the second burst admits 2 and rejects 1. Capacity permits a short burst above the sustained refill rate.",
      nextStep:
        "Repeat the token ledger with a half-second gap and identify which requests must be rejected.",
    },
    helpLevels: [
      "Separate tokens already available from tokens earned over time.",
      "The simultaneous requests at t=0 cannot spend tokens that arrive later.",
      "After the first burst, start the second calculation from an empty bucket and add only one second of refill.",
    ],
  },
  {
    id: "t-3-compare",
    conceptId: 3,
    type: "compare",
    prompt:
      "Compare the two routing policies and choose one for this workload. Either can be defended under the stated constraints; feedback will explain its trade-off.",
    context:
      "Three healthy replicas have equal capacity and share session state. Requests vary greatly in duration. Both policies exclude failed health checks. Policy A sends each new request to the replica with the fewest active requests. Policy B rotates new requests evenly among replicas. Active-request measurements are available but can lag; there is no measured latency difference yet.",
    options: [
      { key: "a", label: "Deploy policy A." },
      { key: "b", label: "Deploy policy B." },
      { key: "c", label: "Pin all requests to one healthy replica." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-routing",
          label: "Distribute work across the healthy replica pool.",
          cause:
            "The decision concentrates traffic on one replica, confusing a healthy target with a target that has enough capacity for all traffic.",
          check: (a) =>
            a.picked?.length === 1 && (a.picked[0] === "a" || a.picked[0] === "b"),
        },
      ],
      validAlternatives: [
        {
          picks: ["a"],
          tradeoff:
            "Fewest-active routing reacts to uneven request durations, but stale counts and connection multiplexing can weaken its estimate of actual load.",
        },
        {
          picks: ["b"],
          tradeoff:
            "Round-robin avoids dependence on active-request measurements and is simple to operate, but equal request counts can produce uneven outstanding work when durations vary.",
        },
      ],
      expected:
        "Both distributed policies are defensible before measurement. Fewest-active routing may handle variable durations better; round-robin offers simpler routing without potentially stale load measurements. Neither adds capacity to an individual replica.",
      nextStep:
        "Replay the same duration distribution against both policies and compare per-replica active requests and tail latency.",
    },
    helpLevels: [
      "Compare outstanding work, not just the number of requests assigned.",
      "Long requests can leave a replica busy after other replicas have finished their turns.",
      "Balance responsiveness to active work against measurement lag; both policies still use the full healthy pool.",
    ],
  },
  {
    id: "t-4-order",
    conceptId: 4,
    type: "order",
    prompt:
      "Order these stages for the configured inbound request path, from the public client to the application.",
    context:
      "Only the reverse proxy accepts public connections. It terminates TLS, removes client-supplied forwarding headers, creates trusted forwarding metadata, and then opens a private upstream request. The application trusts forwarding metadata only from this proxy.",
    options: [
      { key: "app", label: "The application processes the private upstream request." },
      { key: "sanitize", label: "The proxy replaces untrusted forwarding headers." },
      { key: "tls", label: "The proxy accepts and decrypts the public TLS connection." },
      { key: "forward", label: "The proxy sends the request to the private application address." },
    ],
    rubric: {
      criteria: [
        {
          key: "sequence-complete",
          label: "Include every stage exactly once.",
          cause:
            "The sequence skips or duplicates a stage, leaving the public-to-private request path incomplete.",
          check: (a) =>
            a.order?.length === 4 &&
            new Set(a.order).size === 4 &&
            ["tls", "sanitize", "forward", "app"].every((key) => a.order?.includes(key)),
        },
        {
          key: "sequence-boundary",
          label: "Terminate TLS and sanitize metadata before forwarding.",
          cause:
            "The sequence forwards client-controlled metadata before establishing the proxy's trust boundary, allowing spoofed forwarding headers to reach the application.",
          check: (a) =>
            a.order?.length === 4 &&
            a.order.every(
              (key, index) => key === ["tls", "sanitize", "forward", "app"][index],
            ),
        },
      ],
      expected:
        "The order is tls → sanitize → forward → app. The proxy first decrypts the request, then replaces untrusted forwarding metadata before sending it over the private upstream path. A firewall must also prevent direct public access to the application.",
      nextStep:
        "Trace a request containing a forged X-Forwarded-For header and identify which component replaces it.",
    },
    helpLevels: [
      "Start with the component that can accept the public connection.",
      "HTTP headers cannot be inspected until the TLS connection is decrypted.",
      "Place metadata replacement between decryption and the private upstream send; application processing comes after delivery.",
    ],
  },
  {
    id: "t-5-choose-info",
    conceptId: 5,
    type: "choose-info",
    prompt:
      "Choose exactly two pieces of evidence to collect first to test whether the gateway migration removed inconsistent authentication and throttling.",
    context:
      "Twelve services previously implemented their own API-key checks and quotas. A gateway now advertises a shared policy, but some clients report different limits on different routes. You need evidence about enforcement coverage before changing capacity.",
    options: [
      {
        key: "a",
        label:
          "Map public routes and direct service ingress paths to the policies actually attached to them.",
      },
      {
        key: "b",
        label:
          "Replay one API key across several routes and inspect quota decisions and counter scope.",
      },
      { key: "c", label: "Measure aggregate CPU utilization across the service fleet." },
      { key: "d", label: "Compare the sizes of successful response bodies by route." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-coverage",
          label: "Inspect whether every public path crosses policy enforcement.",
          cause:
            "The investigation assumes that configuring a gateway proves enforcement coverage, overlooking direct ingress or routes without an attached policy.",
          check: (a) => a.picked?.includes("a") === true,
        },
        {
          key: "choice-scope",
          label: "Observe whether the same identity shares the intended quota.",
          cause:
            "The investigation treats a common gateway address as proof of a shared quota, without checking identity propagation and counter scope across routes.",
          check: (a) => a.picked?.includes("b") === true,
        },
        {
          key: "selection-budget",
          label: "Keep the first investigation focused on two relevant checks.",
          cause:
            "The selection spends the investigation budget on capacity or payload signals that cannot establish authentication and quota consistency.",
          check: (a) =>
            a.picked?.length === 2 &&
            new Set(a.picked).size === 2 &&
            a.picked.every((key) => key === "a" || key === "b"),
        },
      ],
      expected:
        "Collect the ingress/policy map and a cross-route identity replay. Together they reveal bypass paths, missing policy attachment, and counters scoped differently from the intended shared quota. CPU and response size do not establish policy consistency.",
      nextStep:
        "Build a route-by-identity test matrix, including a direct-service request that should be blocked.",
    },
    helpLevels: [
      "Distinguish where a request travels from how its identity is counted.",
      "A shared entry point can still have uncovered routes or independent quota counters.",
      "Choose one check for enforcement coverage and one controlled replay for cross-route identity behavior.",
    ],
  },
];
