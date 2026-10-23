// Lições âncora autorizadas (PRD project2 D2 / pacote s1-licoes).
// Conteúdo gerado pelo enxame, integrado pelo agente principal (practiceIds
// sincronizados com src/lib/exercises-data).

import type { Lesson } from "./types";

export const LESSONS_PERFORMANCE: Lesson[] = [
  {
    id: 2,
    rev: "2.1",
    objective:
      "Choose a cache key and freshness policy from a concrete read workload, then predict hits, misses, and stale responses.",
    prereqIds: [],
    mentalModel: {
      definition:
        "Caching stores a reusable result closer to its consumer so later requests can avoid repeated computation or retrieval. Correct reuse depends on the cache key, freshness rules, and access boundaries.",
      analogy:
        "A student writes an answer on a sticky note instead of solving the same problem repeatedly.",
      analogyLimits:
        "The note can become outdated, and two apparently similar questions may depend on different currencies, users, or permissions. Remembering an answer does not establish that reuse is correct.",
      correspondence: [
        ["Cache key", "Label identifying the exact question"],
        ["Cached value", "Written answer"],
        ["TTL or invalidation", "Rule for replacing an outdated note"],
      ],
    },
    scenario: {
      system: "A product catalog using cache-aside reads.",
      data: "A teaching sequence requests the same product in USD at 0, 10, and 20 seconds. A cached value has a 30-second TTL; the source price changes at second 15.",
      symptom:
        "Database reads fall, but the request at second 20 receives the previous display price.",
      constraints: [
        "Catalog display prices may be stale for up to 30 seconds.",
        "Checkout must validate the current price against the authoritative source.",
        "Currency must be part of the cache key.",
      ],
      baseline:
        "Without caching, all three reads reach the database. With the stated cache, one miss loads the value and two hits reuse it.",
    },
    representation: {
      kind: "request-flow",
      caption: "A cache hit avoids a source read but does not prove freshness.",
      data: {
        nodes: [
          { id: "reader", label: "Catalog request" },
          { id: "cache", label: "Cache: product and currency key" },
          { id: "db", label: "Authoritative product store" },
          { id: "response", label: "Display response" },
        ],
        edges: [
          { from: "reader", to: "cache", label: "Look up key" },
          { from: "cache", to: "response", label: "Hit: reuse value" },
          { from: "cache", to: "db", label: "Miss: fetch and populate" },
          { from: "db", to: "response", label: "Return fetched value" },
        ],
        window: { durationMs: 30000, label: "One illustrative TTL" },
        limits: { ttlSeconds: 30, keyDimensions: ["productId", "currency"] },
      },
      textEquivalent:
        "At second 0, a miss loads the USD price. Seconds 10 and 20 are hits. The source changes at second 15, so the second-20 response is stale but within the stated display tolerance.",
    },
    worked: {
      decision:
        "Cache catalog display values by product and currency for 30 seconds, while validating checkout prices independently.",
      reasoning: [
        "Repeated reads of the same key are candidates for reuse because their output dependencies match.",
        "The initial miss performs a database read and stores the result; the next two requests reuse it.",
        "A source update does not automatically invalidate a separate cache, so the second-20 response remains old.",
        "The display policy explicitly accepts bounded staleness; checkout has a different correctness requirement.",
        "Measure hit ratio, miss latency, and stale-value incidents; a high hit ratio alone does not demonstrate correctness.",
      ],
    },
    contrast: [
      {
        alternative: "Invalidate on every product update",
        tradeoff:
          "Can reduce stale reads but introduces delivery, ordering, and race conditions between updates and cache fills.",
        whenNotToUse:
          "Do not assume invalidation guarantees immediate consistency unless the full update-and-read protocol establishes it.",
      },
    ],
    misconceptions: [
      {
        wrong: "A cache key containing the product ID is always sufficient.",
        discriminant:
          "List every input that changes the returned value or who may see it.",
        counterexample:
          "A USD request populates a product-only key; a later EUR request receives the USD amount labeled as EUR.",
      },
    ],
    practiceIds: ["t-2-predict", "t-2-variant"],
    evidenceCriteria: [
      "Classify the three requests as miss, hit, and hit.",
      "Identify the second-20 response as stale and explain why it is permitted only for display.",
      "Include currency in the key and separate checkout correctness from catalog freshness.",
    ],
    transfer: {
      variant:
        "Cache a school timetable while ensuring student-specific accommodations cannot leak through a shared cache key.",
      domain: "Education software",
    },
    provenance: {
      reviewed: false,
      notes:
        "Expanded from canonical concept 2. TTL and request times are teaching values, not recommended production defaults. Independent technical review is pending.",
    },
  },
  {
    id: 27,
    rev: "2.1",
    objective:
      "Detect query-count growth from a request trace and replace per-record relationship fetches with a bounded retrieval plan.",
    prereqIds: [],
    mentalModel: {
      definition:
        "An N+1 query pattern occurs when one query retrieves N records and subsequent code issues an additional query for each record to obtain related data.",
      analogy:
        "A waiter brings ten pancakes, then makes a separate trip for each pancake's butter.",
      analogyLimits:
        "A database join can multiply rows, and one enormous trip may transfer more data than several bounded trips. Fewer queries are not automatically less total work.",
      correspondence: [
        ["Initial list query", "Trip bringing the pancakes"],
        ["Per-record relationship query", "Separate butter trip for each pancake"],
        ["Batch fetch", "One trip carrying the required butter portions"],
      ],
    },
    scenario: {
      system: "A blog feed displaying 20 posts and their authors.",
      data: "The teaching model has five distinct authors and a fixed 4 ms round-trip overhead per sequential query, excluding execution and transfer.",
      symptom:
        "The trace contains one post query followed by 20 author queries.",
      constraints: [
        "The feed remains paginated to 20 posts.",
        "Only author ID and display name are needed.",
        "The solution must preserve posts and their author mapping.",
      ],
      baseline:
        "There are 21 queries and 84 ms of modeled round-trip overhead; repeated authors do not prevent the naive loop from fetching them again.",
    },
    representation: {
      kind: "query-explainer",
      caption: "Compare query-count growth, not just one fast local execution.",
      data: {
        rows: [
          { plan: "Lazy per-post author fetch", posts: 20, queries: 21, overheadMs: 84 },
          { plan: "Batch distinct authors", posts: 20, queries: 2, overheadMs: 8 },
          { plan: "Posts joined to authors", posts: 20, queries: 1, overheadMs: 4 },
        ],
        queries: [
          "SELECT id, author_id, title FROM posts ORDER BY created_at DESC LIMIT 20",
          "SELECT id, display_name FROM authors WHERE id IN (...)",
        ],
        assumptions: "Sequential queries; 4 ms fixed overhead; execution and transfer excluded.",
      },
      textEquivalent:
        "For 20 posts, lazy loading issues 21 queries with 84 ms modeled overhead. A distinct-author batch uses two queries and 8 ms; a suitable join uses one query and 4 ms. These are overhead estimates, not total latency predictions.",
    },
    worked: {
      decision:
        "Fetch the page of posts, collect its distinct author IDs, then fetch those authors in one bounded query and map by ID.",
      reasoning: [
        "Count queries within one feed request: one list query plus 20 relationship queries equals 21.",
        "Five distinct authors mean repeated per-post lookups are redundant, but the structural problem is the loop issuing queries.",
        "Collect unique author IDs from the already bounded page; the second query returns at most those five authors.",
        "Map each post to its author without changing post ordering or dropping records with missing optional relationships.",
        "Compare a join as another valid plan, then inspect row volume and execution plans rather than declaring any single query optimal.",
      ],
    },
    contrast: [
      {
        alternative: "Join the required author fields into the post query",
        tradeoff:
          "Can eliminate a round trip, but joins to multiple one-to-many relationships may multiply rows and complicate pagination.",
        whenNotToUse:
          "Do not blindly join every relationship when row multiplication changes page semantics or transfers excessive repeated data.",
      },
    ],
    misconceptions: [
      {
        wrong: "A fast individual query means there is no N+1 problem.",
        discriminant:
          "Measure how query count grows when the number of displayed records grows.",
        counterexample:
          "An author query taking only 4 ms of overhead still contributes 80 ms when issued sequentially for 20 posts.",
      },
    ],
    practiceIds: ["t-27-find-flaw"],
    evidenceCriteria: [
      "Derive N + 1 queries and calculate 21 for 20 posts.",
      "Produce a bounded two-query retrieval plan with correct author mapping.",
      "Explain why query count, row volume, and pagination semantics all matter.",
    ],
    transfer: {
      variant:
        "Replace one remote employee-directory call per payroll row with a bounded batch lookup, preserving missing-employee handling.",
      domain: "Payroll integration",
    },
    provenance: {
      reviewed: false,
      notes:
        "Expanded from canonical concept 27. Latency arithmetic isolates illustrative round-trip overhead and makes no total-performance guarantee. Independent technical review is pending.",
    },
  },
  {
    id: 91,
    rev: "2.1",
    objective:
      "Calculate nearest-rank P50 and P99 from a defined latency sample and distinguish tail evidence from an average.",
    prereqIds: [],
    mentalModel: {
      definition:
        "Latency is elapsed time between defined start and completion events. A percentile summarizes a distribution: under the nearest-rank convention, P99 is the value at rank ceil(0.99 × N) after sorting N observations.",
      analogy:
        "Record the waiting time for every customer in a queue, then inspect the customer near the slow end rather than only the average wait.",
      analogyLimits:
        "A percentile is not the probability that the next customer waits exactly that long, and a small or selectively recorded sample may not represent future traffic. Different percentile conventions can also differ.",
      correspondence: [
        ["Latency observation", "One customer's measured wait"],
        ["P50", "Middle ranked wait"],
        ["P99", "Wait at the 99th-percentile rank"],
      ],
    },
    scenario: {
      system: "A checkout endpoint measured from request arrival to response completion.",
      data: "A teaching sample contains 100 completed requests: 95 at 50 ms, three at 200 ms, and two at 1000 ms.",
      symptom:
        "The mean looks modest while some customers experience a full second of waiting.",
      constraints: [
        "Use nearest-rank percentiles for this exercise.",
        "Report the sample size and measurement boundary.",
        "Track timeouts and failures separately rather than silently omitting them.",
      ],
      baseline:
        "The mean is 73.5 ms, P50 is 50 ms, and P99 is 1000 ms. The mean conceals the magnitude of the slow tail.",
    },
    representation: {
      kind: "latency-histogram",
      caption: "Locate percentile ranks in the cumulative request count.",
      data: {
        unit: "ms",
        bins: [
          { min: 0, max: 100, count: 95, label: "95 observations at 50 ms" },
          { min: 100, max: 500, count: 3, label: "3 observations at 200 ms" },
          { min: 500, max: 1500, count: 2, label: "2 observations at 1000 ms" },
        ],
        sample: { count: 100, values: [{ value: 50, count: 95 }, { value: 200, count: 3 }, { value: 1000, count: 2 }] },
        markers: [
          { label: "P50", value: 50 },
          { label: "Mean", value: 73.5 },
          { label: "P99", value: 1000 },
        ],
        scenario: "Completed checkout requests in one illustrative window",
        note: "Exact repeated values support the arithmetic; coarse bins alone would only bound a percentile.",
      },
      textEquivalent:
        "Sorted ranks 1–95 are 50 ms, ranks 96–98 are 200 ms, and ranks 99–100 are 1000 ms. P50 is rank 50: 50 ms. P99 is rank 99: 1000 ms. Mean: 7350 divided by 100, or 73.5 ms.",
    },
    worked: {
      decision:
        "Report P50, P99, sample size, and failures, then use traces to investigate slow database calls or remote hops.",
      reasoning: [
        "Define the boundary first; browser-perceived latency and server-only latency measure different intervals.",
        "Sort the 100 observations and select rank ceil(0.50 × 100) = 50 for P50.",
        "Select rank ceil(0.99 × 100) = 99 for P99; it falls among the 1000 ms observations.",
        "Compute the mean as (95 × 50 + 3 × 200 + 2 × 1000) / 100 = 73.5 ms.",
        "The distribution demonstrates a tail, not its cause. Correlate slow traces with queries, network hops, and queueing before choosing a fix.",
      ],
    },
    contrast: [
      {
        alternative: "Report only average latency",
        tradeoff:
          "A mean is compact and useful for some aggregate calculations but can hide a small group of very slow requests.",
        whenNotToUse:
          "Do not use the mean alone to judge a user-facing tail-latency objective.",
      },
    ],
    misconceptions: [
      {
        wrong: "The overall P99 is the average of each server's P99.",
        discriminant:
          "Ask whether summaries preserve the weighted underlying distribution.",
        counterexample:
          "Server A handles 990 requests at 10 ms and B handles 10 at 1000 ms. Their P99 average is 505 ms, but combined nearest-rank P99 is 10 ms at rank 990.",
      },
    ],
    practiceIds: ["t-91-predict"],
    evidenceCriteria: [
      "Calculate P50 = 50 ms, P99 = 1000 ms, and mean = 73.5 ms using the stated convention.",
      "Explain why coarse histogram bins cannot reveal exact values without additional information.",
      "Request measurement boundaries, sample sizes, failures, and slow traces before recommending an optimization.",
    ],
    transfer: {
      variant:
        "Measure document-processing turnaround from submission to delivery, including failed jobs, and explain why median completion time alone misses delayed customers.",
      domain: "Administrative workflow analytics",
    },
    provenance: {
      reviewed: false,
      notes:
        "Expanded from canonical concept 91, Latency, with percentiles as its measurement lens. Canonical concept 93 remains distinct. Samples are instructional, not service-level recommendations. Independent technical review is pending.",
    },
  },
];
