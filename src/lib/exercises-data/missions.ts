import type { Task } from "@/lib/exercises";

/**
 * Tarefas de prática das missões (PRD project2 §17, pacote s7-missoes).
 * Conteúdo produzido pelo subagente s7 e escrito pelo agente principal —
 * ids no padrão `t-<conceptId>-<tipo>`, 1 critério e 3 níveis de apoio.
 */
export const TASKS_MISSIONS: Task[] = [
  {
    id: "t-11-predict",
    conceptId: 11,
    type: "predict",
    prompt:
      "Before any experiment, predict what the client and the remote service each know at t=2.5 seconds. Choose one.",
    context:
      "A checkout client waits at most 2 seconds for a processor reply. The processor receives the request at t=0.5, commits the work at t=1.8, and its reply is delayed on the network until t=3. The client gives up at t=2.",
    options: [
      { key: "a", label: "Client: the work failed. Service: the work did not happen." },
      { key: "b", label: "Client: the outcome is unknown. Service: the work already happened." },
      { key: "c", label: "Client: the work succeeded. Service: the work already happened." },
      { key: "d", label: "Client: the outcome is unknown. Service: the work did not happen." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-unknown",
          label: "Separate the end of the caller's wait from the remote outcome.",
          cause:
            "The prediction treats an expired wait as proof that the remote work did not happen.",
          check: (a) => a.picked?.length === 1 && a.picked[0] === "b",
        },
      ],
      expected:
        "The client stopped waiting at t=2 and has no reply, so for it the outcome is unknown. The service committed at t=1.8, before the client gave up. Expiry of the wait says nothing about what the remote side did.",
      nextStep: "Trace what happens if the client repeats the same request at t=2.1.",
    },
    helpLevels: [
      "Give each side its own timeline.",
      "Compare the commit time with the moment the client gives up.",
      "The client's information ends at its deadline; the service's does not.",
    ],
  },
  {
    id: "t-14-compare",
    conceptId: 14,
    type: "compare",
    prompt:
      "Choose a policy for repeating the checkout call that preserves the invariant: one purchase never produces an additional charge. More than one answer can be valid.",
    context:
      "A checkout call timed out and the outcome is unknown. The processor accepts an operation key supplied by the caller and, for a repeated key, returns the original result without redoing the work. It also exposes a status lookup by that key. The customer pressed buy once.",
    options: [
      { key: "a", label: "Repeat the call with a newly generated key each time." },
      { key: "b", label: "Repeat the call reusing the original key until a result arrives." },
      {
        key: "c",
        label:
          "Look up the status by the original key first, and repeat with that key only if no record exists.",
      },
      { key: "d", label: "Tell the customer the purchase failed and drop the attempt." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-invariant",
          label: "Repeat the same operation without creating a second one.",
          cause:
            "The policy either treats each repeat as a new operation or claims a failure the store cannot confirm.",
          check: (a) => a.picked?.length === 1 && (a.picked[0] === "b" || a.picked[0] === "c"),
        },
      ],
      validAlternatives: [
        {
          picks: ["b"],
          tradeoff:
            "Simplest: one step and the processor deduplicates, but it relies on the processor honoring repeated keys and keeps sending requests during an outage.",
        },
        {
          picks: ["c"],
          tradeoff:
            "Adds a lookup before repeating and so more latency and one more dependency, but it shows the real state to the customer and avoids repeating blindly.",
        },
      ],
      expected:
        "Both b and c keep every attempt tied to the same operation, so repeating cannot bill twice. A new key per attempt makes each repeat a new purchase. Dropping the attempt asserts a failure that is unknown and may leave a charge without an order.",
      nextStep:
        "Remove the status lookup and ask what happens if the processor does not honor repeated keys.",
    },
    helpLevels: [
      "Ask what identifies 'the same purchase' across attempts.",
      "A repeat is only safe if the remote side can recognize it.",
      "Compare which options make the second attempt look like the first.",
    ],
  },
  {
    id: "t-14-variant",
    conceptId: 14,
    type: "variant",
    prompt: "Choose the design that keeps one user action from creating more than one document. Choose one.",
    context:
      "A collaborative editor lets a user create a new document. The create request sometimes times out without a response, and the interface offers a retry button. The server can store a client-supplied identifier with each document and rejects or returns the existing document for a repeated identifier.",
    options: [
      { key: "a", label: "Generate a new random identifier on every retry." },
      { key: "b", label: "Generate the identifier once per user action and send it on every retry." },
      { key: "c", label: "Retry only if the document list currently looks empty." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-identity",
          label: "Bind all retries of one action to one identity.",
          cause:
            "The design lets each retry look like a new action, or relies on a view that may lag behind the real state.",
          check: (a) => a.picked?.length === 1 && a.picked[0] === "b",
        },
      ],
      expected:
        "Creating the identifier once per user action lets the server recognize repeats of the same creation. A fresh identifier per retry makes duplicates possible. The list view can be stale or concurrent, so it cannot prove nothing was created.",
      nextStep:
        "Add a second tab where the same user starts a different creation and check that it still gets its own identifier.",
    },
    helpLevels: [
      "Which thing stays the same across retries?",
      "Where is the identity of the action created, and how often?",
      "A view of current state may lag behind what the server already stored.",
    ],
  },
  {
    id: "t-27-compare",
    conceptId: 27,
    type: "compare",
    prompt:
      "Choose how the catalog page reads data and keeps it up to date. Both a and b are defensible; feedback explains the cost of each.",
    context:
      "The catalog page lists 40 products, each with its category name, using one lookup per product today. Prices change a few times a day and a stale price is acceptable for up to 60 seconds. Writes cannot reliably publish invalidation events.",
    options: [
      {
        key: "a",
        label:
          "Fetch products with categories in one set-based query, and cache the page data for 60 seconds from each fetch.",
      },
      {
        key: "b",
        label: "Fetch products with categories in one set-based query on every request, with no cache.",
      },
      { key: "c", label: "Keep one lookup per product and cache each result for one hour." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-access-update",
          label: "Fix repeated round trips and bound staleness to the stated allowance.",
          cause:
            "The choice keeps per-item round trips, or lets stale data live far longer than the allowance.",
          check: (a) => a.picked?.length === 1 && (a.picked[0] === "a" || a.picked[0] === "b"),
        },
      ],
      validAlternatives: [
        {
          picks: ["a"],
          tradeoff:
            "Fewer database reads under load, but prices can be up to 60 seconds old and the cache needs monitoring.",
        },
        {
          picks: ["b"],
          tradeoff:
            "Always current and simpler to reason about, but every view reaches the database and may need capacity or a cache later.",
        },
      ],
      expected:
        "Both a and b remove the per-product round trips with one set-based query. A bounds staleness to the allowance by a fixed lifetime; B has no staleness at all but no read saving. Option c keeps the slow access pattern and allows hour-old data.",
      nextStep:
        "Add a measure: would your choice change the average or the slowest requests, and which does the complaint refer to?",
    },
    helpLevels: [
      "Treat reading and keeping fresh as two separate questions.",
      "Compare how many round trips each option keeps and how old data can get.",
      "Check each option against the 60-second allowance.",
    ],
  },
  {
    id: "t-27-variant",
    conceptId: 27,
    type: "variant",
    prompt: "Choose the approach that makes the feed fast without showing outdated authors for long. Choose one.",
    context:
      "A feed shows 30 posts with their authors. New posts arrive every few seconds; author names and photos change rarely, and a change may take up to 10 minutes to appear. Today each post triggers its own author lookup. Writes cannot reliably publish invalidation events.",
    options: [
      { key: "a", label: "Cache the whole rendered feed for 10 minutes." },
      {
        key: "b",
        label:
          "Load posts with their authors in one set-based query per page view, and reuse author data for up to 10 minutes from fetch.",
      },
      { key: "c", label: "Keep per-post author lookups but run them concurrently." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-pattern",
          label: "Match caching to what changes slowly, not to the whole page.",
          cause:
            "The choice either hides new posts that change constantly or keeps the per-post round trips.",
          check: (a) => a.picked?.length === 1 && a.picked[0] === "b",
        },
      ],
      expected:
        "Posts change constantly and authors rarely. Fetching posts with authors in one query removes the per-post lookups, and reusing author data for a bounded time exploits the slow change. Caching the whole feed hides new posts for 10 minutes; concurrency keeps every round trip.",
      nextStep:
        "Invert the pattern: authors change often and posts rarely. Which part would you reuse then?",
    },
    helpLevels: [
      "Which part changes fast and which part changes slowly?",
      "Concurrent calls still make one round trip per post.",
      "Reuse is safe only for what tolerates being old.",
    ],
  },
];
