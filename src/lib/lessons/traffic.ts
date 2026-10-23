// Lições âncora autorizadas (PRD project2 D2 / pacote s1-licoes).
// Conteúdo gerado pelo enxame, integrado pelo agente principal (practiceIds
// sincronizados com src/lib/exercises-data).

import type { Lesson } from "./types";

export const LESSONS_TRAFFIC: Lesson[] = [
  {
    id: 1,
    rev: "2.1",
    objective:
      "Trace a token bucket through a burst and justify the identity key, rejection behavior, and shared-state requirement.",
    prereqIds: [],
    mentalModel: {
      definition:
        "Rate limiting bounds admissions for a defined identity and scope over time. A token bucket admits a request only when enough tokens are available; tokens refill at a configured rate up to a fixed capacity.",
      analogy:
        "An ice cream counter issues scoop tickets gradually and allows each customer to save only a small stack.",
      analogyLimits:
        "Digital identities are not necessarily people: many users can share an IP, and an attacker can rotate IPs. Tickets also do not capture variable request cost or coordination between server replicas.",
      correspondence: [
        ["Bucket capacity", "Maximum stack of saved tickets"],
        ["Refill rate", "Rate at which new tickets become available"],
        ["Admission", "Exchanging a ticket for service"],
      ],
    },
    scenario: {
      system: "A public product-search API served by two application replicas.",
      data: "A teaching model starts one account with four tokens, refills two tokens per second, and charges one token per search.",
      symptom:
        "A buggy client sends six simultaneous searches while other accounts are waiting.",
      constraints: [
        "The limit applies across both replicas, not separately on each one.",
        "Authenticated accounts are the primary key; anonymous traffic needs a separate policy.",
        "Rejected requests must not execute the expensive search.",
      ],
      baseline:
        "Without admission control, all six searches reach the database. With a full shared bucket, four are admitted and two are rejected at the initial instant.",
    },
    representation: {
      kind: "request-flow",
      caption: "Observe where rejection prevents downstream work.",
      data: {
        nodes: [
          { id: "client", label: "Account: six simultaneous searches" },
          { id: "limiter", label: "Shared token bucket" },
          { id: "search", label: "Search: four admitted" },
          { id: "reject", label: "429: two rejected" },
        ],
        edges: [
          { from: "client", to: "limiter", label: "6 requests" },
          { from: "limiter", to: "search", label: "4 tokens consumed" },
          { from: "limiter", to: "reject", label: "No tokens remaining" },
        ],
        window: { durationMs: 1000, label: "Initial burst, then refill" },
        limits: { capacity: 4, refillPerSecond: 2, costPerRequest: 1 },
      },
      textEquivalent:
        "At time zero, six requests encounter four tokens: four proceed and two receive 429. After one idle second, two tokens are available. Capacity never exceeds four.",
    },
    worked: {
      decision:
        "Use an atomic shared token bucket keyed by account, return 429 with useful retry guidance, and retain a separate anonymous policy.",
      reasoning: [
        "A full bucket contains four tokens, so six simultaneous requests cannot all be admitted.",
        "Each admitted request removes one token; the fifth and sixth requests find none.",
        "One idle second restores two tokens, allowing two new requests rather than resetting an arbitrary counter.",
        "Independent full buckets on two replicas could admit eight requests across them, violating the intended account-wide burst bound.",
        "Verify limiter-store failure behavior explicitly; neither silently allowing everything nor denying everyone is universally correct.",
      ],
    },
    contrast: [
      {
        alternative: "A fixed-window counter",
        tradeoff:
          "Simpler accounting, but traffic can cluster around a window boundary and create a burst approaching twice the window allowance.",
        whenNotToUse:
          "Do not use it when the requirement is smooth admission across boundaries rather than a count within named windows.",
      },
    ],
    misconceptions: [
      {
        wrong: "A per-IP limit gives every person a fair allowance.",
        discriminant:
          "Ask whether the key identifies a person, an account, a network, or a device.",
        counterexample:
          "One hundred students behind a campus NAT share one public IP and would compete for the same bucket.",
      },
    ],
    practiceIds: ["t-1-predict"],
    evidenceCriteria: [
      "Predict four admissions at time zero and two after one idle second.",
      "Explain how independent replica counters violate a shared account limit.",
      "Name one identity-selection failure and one limiter-store failure policy.",
    ],
    transfer: {
      variant:
        "Design a per-tenant export-job admission limit, explaining why job cost and concurrent jobs may need controls beyond requests per second.",
      domain: "Background data processing",
    },
    provenance: {
      reviewed: false,
      notes:
        "Expanded from canonical concept 1. Numerical values are a teaching model, not production sizing. Independent technical review is pending.",
    },
  },
  {
    id: 3,
    rev: "2.1",
    objective:
      "Select a routing strategy from backend health and active-work observations, then identify what balancing cannot repair.",
    prereqIds: [],
    mentalModel: {
      definition:
        "Load balancing distributes requests or connections across eligible backends according to a routing policy and health information.",
      analogy:
        "A cafeteria attendant directs students toward serving lines that are open.",
      analogyLimits:
        "An equal number of students does not imply equal work: one order may take much longer. A line can also appear open before a health check detects failure, and the attendant itself needs resilience.",
      correspondence: [
        ["Backend", "Serving line"],
        ["Health check", "Check that a line can serve"],
        ["Routing policy", "Rule for choosing a line"],
      ],
    },
    scenario: {
      system: "Three interchangeable image-preview API replicas behind a balancer.",
      data: "In a teaching snapshot, A has eight active requests, B has two, and C is unhealthy. A and B have equal capacity.",
      symptom:
        "Round-robin sends new work to A even though its existing requests are unusually slow.",
      constraints: [
        "Requests carry no local session state.",
        "Active request counts are available.",
        "Health information can lag actual failure.",
      ],
      baseline:
        "Round-robin alternates eligible A and B without considering their eight-versus-two active-work imbalance.",
    },
    representation: {
      kind: "request-flow",
      caption: "Eligibility is checked before comparing active work.",
      data: {
        nodes: [
          { id: "lb", label: "Balancer" },
          { id: "a", label: "A: healthy, 8 active" },
          { id: "b", label: "B: healthy, 2 active" },
          { id: "c", label: "C: unhealthy" },
        ],
        edges: [
          { from: "lb", to: "a", label: "Eligible" },
          { from: "lb", to: "b", label: "Next request: least active" },
          { from: "lb", to: "c", label: "Excluded" },
        ],
        window: { label: "One routing decision", durationMs: 0 },
        limits: { eligibleBackends: 2, unhealthyBackends: 1 },
      },
      textEquivalent:
        "A and B are eligible; C is excluded. A has eight active requests and B has two. A least-active-request policy selects B for the next request.",
    },
    worked: {
      decision:
        "Use least-active-request routing for this workload and remove C from eligibility while investigating its failure.",
      reasoning: [
        "Exclude C before applying a distribution policy; balancing toward a failed backend creates avoidable failures.",
        "Equal-capacity A and B have unequal outstanding work, so alternating requests does not address the observed imbalance.",
        "Choose B for the next request, then re-evaluate updated counts rather than sending every future request there.",
        "If only connection counts are available, check protocol behavior: multiplexed connections may carry very different amounts of work.",
        "Measure downstream capacity too; distributing requests cannot repair a database shared by every replica.",
      ],
    },
    contrast: [
      {
        alternative: "Round-robin",
        tradeoff:
          "Requires less load information and works well with similar request costs, but ignores outstanding work.",
        whenNotToUse:
          "Do not rely on it to correct persistent imbalance from long-lived or highly variable requests.",
      },
      {
        alternative: "IP-hash affinity",
        tradeoff:
          "Can preserve locality but may skew distribution and complicate failover.",
        whenNotToUse:
          "Do not use it merely to compensate for avoidable application-local session state.",
      },
    ],
    misconceptions: [
      {
        wrong: "Adding a load balancer removes every single point of failure.",
        discriminant:
          "Identify which components remain shared and whether the balancing layer itself has redundancy.",
        counterexample:
          "Three balanced API replicas still fail together when their only database is unavailable.",
      },
    ],
    practiceIds: ["t-3-compare"],
    evidenceCriteria: [
      "Exclude unhealthy C and select B using the stated observations.",
      "Distinguish active requests from connection counts.",
      "Identify a shared bottleneck that balancing cannot fix.",
    ],
    transfer: {
      variant:
        "Assign rendering jobs to equal-capacity workers using outstanding work, then explain why queue length alone fails when job sizes differ.",
      domain: "Media production scheduling",
    },
    provenance: {
      reviewed: false,
      notes:
        "Expanded from canonical concept 3. Backend counts are an illustrative snapshot, not a capacity recommendation. Independent technical review is pending.",
    },
  },
  {
    id: 4,
    rev: "2.1",
    objective:
      "Trace a proxied request across its trust boundaries and identify the network and header controls needed to prevent bypass.",
    prereqIds: [],
    mentalModel: {
      definition:
        "A reverse proxy accepts client requests on behalf of backend services and forwards them upstream. It can terminate TLS, route requests, and normalize traffic at the server boundary.",
      analogy:
        "A butler receives visitors at the front door and carries requests to rooms inside the house.",
      analogyLimits:
        "A butler does not automatically lock side doors. Likewise, deploying a proxy neither blocks direct backend access nor makes client-supplied headers trustworthy.",
      correspondence: [
        ["Public proxy listener", "Front door"],
        ["Private backend", "Interior room"],
        ["Forwarded request", "Message carried by the butler"],
      ],
    },
    scenario: {
      system: "A web application moved behind a TLS-terminating reverse proxy.",
      data: "The proxy listens on public port 443; the application listens on port 3000 and still has a public network rule.",
      symptom:
        "A caller bypasses proxy filtering by reaching port 3000 directly and supplies a forged forwarding header.",
      constraints: [
        "The application needs the original client address for audit logs.",
        "Only the intended proxy should reach the application listener.",
        "Encryption requirements apply separately to each network hop.",
      ],
      baseline:
        "The proxy serves normal traffic, but the directly reachable backend leaves a second, uncontrolled entrance.",
    },
    representation: {
      kind: "request-flow",
      caption: "A public proxy is not protection while a backend bypass remains.",
      data: {
        nodes: [
          { id: "client", label: "Internet client" },
          { id: "proxy", label: "Proxy: public 443" },
          { id: "app", label: "Application: port 3000" },
        ],
        edges: [
          { from: "client", to: "proxy", label: "Expected TLS path" },
          { from: "proxy", to: "app", label: "Controlled upstream hop" },
          { from: "client", to: "app", label: "Bypass: must be blocked" },
        ],
        window: { label: "One request and its possible paths", durationMs: 0 },
        limits: { publicListeners: [443], backendAllowedSource: "proxy only" },
      },
      textEquivalent:
        "Expected path: client to proxy on 443, then proxy to application on 3000. The direct client-to-application path must be blocked by network policy.",
    },
    worked: {
      decision:
        "Restrict backend ingress to the proxy, sanitize forwarding headers, and configure the application to trust only the known proxy chain.",
      reasoning: [
        "TLS termination at the proxy protects the client-to-proxy hop; it says nothing by itself about the upstream hop.",
        "Block direct public access to port 3000 so filtering cannot be bypassed through another entrance.",
        "Discard or normalize untrusted forwarding headers before constructing the trusted client-address chain.",
        "Configure the application's proxy trust boundary explicitly rather than accepting every claimed client address.",
        "Test both the legitimate route and the prohibited direct route; a successful proxied request alone proves too little.",
      ],
    },
    contrast: [
      {
        alternative: "Expose the application directly with native TLS",
        tradeoff:
          "Removes a hop and proxy configuration, but places edge handling and public exposure on the application.",
        whenNotToUse:
          "Do not introduce a separate proxy solely to claim security if no enforceable boundary or operational benefit is defined.",
      },
    ],
    misconceptions: [
      {
        wrong: "X-Forwarded-For is reliable because it is an HTTP header.",
        discriminant:
          "Determine who supplied each header value and which intermediary is trusted to normalize it.",
        counterexample:
          "A direct caller sends X-Forwarded-For claiming an administrator's address; without a restricted trust chain, the log records the forged identity.",
      },
    ],
    practiceIds: ["t-4-order"],
    evidenceCriteria: [
      "Identify and close the direct backend path.",
      "Explain why incoming forwarding headers need normalization.",
      "Distinguish TLS protection on the external and upstream hops.",
    ],
    transfer: {
      variant:
        "Place a legacy document service behind an organizational access proxy and specify how to prevent users from opening the legacy listener directly.",
      domain: "Enterprise document access",
    },
    provenance: {
      reviewed: false,
      notes:
        "Expanded from canonical concept 4. Network and header policies require environment-specific validation. Independent technical review is pending.",
    },
  },
  {
    id: 5,
    rev: "2.1",
    objective:
      "Separate shared API-edge policies from resource-specific authorization and trace where a denied request must stop.",
    prereqIds: [1, 4],
    mentalModel: {
      definition:
        "An API gateway is an API-facing intermediary that applies shared policies such as authentication, throttling, routing, and telemetry before forwarding requests to services.",
      analogy:
        "A building security desk checks visitor credentials and directs visitors to the correct department.",
      analogyLimits:
        "A valid building badge does not grant access to every confidential file. Gateway authentication cannot replace a service's resource-specific authorization or business invariants.",
      correspondence: [
        ["Credential validation", "Badge inspection"],
        ["API routing", "Department directions"],
        ["Resource authorization", "Permission to open a particular file"],
      ],
    },
    scenario: {
      system: "An orders API and a profile API with duplicated token checks.",
      data: "A valid token identifies tenant A; a request asks for an order owned by tenant B.",
      symptom:
        "One service checks only token validity and returns another tenant's order.",
      constraints: [
        "Services remain responsible for ownership checks.",
        "Direct service access must not bypass the intended authentication boundary.",
        "Gateway policy changes need versioned tests and observability.",
      ],
      baseline:
        "Duplicated authentication implementations drift, and token validity is incorrectly treated as permission to read every order.",
    },
    representation: {
      kind: "request-flow",
      caption: "Passing authentication does not imply passing authorization.",
      data: {
        nodes: [
          { id: "client", label: "Tenant A client" },
          { id: "gateway", label: "Gateway: validate token and quota" },
          { id: "orders", label: "Orders: check tenant ownership" },
          { id: "profiles", label: "Profiles: check resource permission" },
        ],
        edges: [
          { from: "client", to: "gateway", label: "Request with token" },
          { from: "gateway", to: "orders", label: "Order route and trusted identity" },
          { from: "gateway", to: "profiles", label: "Profile route" },
        ],
        window: { label: "One authenticated request", durationMs: 0 },
        limits: { identityTenant: "A", requestedOrderTenant: "B" },
      },
      textEquivalent:
        "The gateway validates tenant A's token and routes the order request. The orders service compares tenant A with owner tenant B and denies access.",
    },
    worked: {
      decision:
        "Centralize token validation, quota policy, and request identifiers at the gateway; retain tenant ownership enforcement in each resource-owning service.",
      reasoning: [
        "Signature and expiry checks are shared concerns that can drift when copied between services.",
        "The gateway establishes a trusted identity, not universal permission.",
        "The orders service has the authoritative ownership data and must reject the A-versus-B mismatch.",
        "Strip spoofable identity headers and protect service ingress so callers cannot manufacture gateway-approved identity.",
        "Monitor gateway failures separately: centralizing policy creates a shared dependency and change blast radius.",
      ],
    },
    contrast: [
      {
        alternative: "A simple reverse proxy with service-local policies",
        tradeoff:
          "Avoids a large shared policy layer but requires disciplined consistency across services.",
        whenNotToUse:
          "Do not add a gateway platform to a single simple API unless concrete policy or routing needs justify its operational cost.",
      },
    ],
    misconceptions: [
      {
        wrong: "Authenticated requests are authorized requests.",
        discriminant:
          "Separate who the caller is from which specific resource the caller may access.",
        counterexample:
          "Tenant A presents a valid token but must still be denied tenant B's order.",
      },
    ],
    practiceIds: ["t-5-choose-info"],
    evidenceCriteria: [
      "Place credential checks before forwarding and ownership checks before resource disclosure.",
      "Explain why a valid tenant A token cannot authorize tenant B's order.",
      "Identify the bypass and shared-dependency risks introduced by the design.",
    ],
    transfer: {
      variant:
        "Design a partner-facing research-data gateway that validates organization credentials while each dataset service enforces dataset-specific consent.",
      domain: "Research data exchange",
    },
    provenance: {
      reviewed: false,
      notes:
        "Expanded from canonical concept 5. The gateway/service split is an instructional design, not a production security certification. Independent technical review is pending.",
    },
  },
];
