import type { Task } from "@/lib/exercises";

// Tarefas de prática âncora de Resilience (PRD project2 D8 / pacote s3-exercicios).
export const TASKS_RESILIENCE: Task[] = [
  {
    id: "t-10-predict",
    conceptId: 10,
    type: "predict",
    prompt:
      "Before sending the next requests, predict the downstream attempt count while the breaker is open and at its first recovery check. Choose one.",
    context:
      "A recommendation API has tripped its circuit breaker. The breaker remains open from t=0 until t=10 seconds. During that interval, 40 requests arrive and receive a local fallback. At t=10, three requests arrive together. This breaker's half-open policy admits exactly one probe and immediately gives fallback to other arrivals while that probe is pending. The probe has not completed yet.",
    options: [
      { key: "a", label: "0 downstream attempts before t=10; 1 at t=10." },
      { key: "b", label: "40 downstream attempts before t=10; 1 at t=10." },
      { key: "c", label: "0 downstream attempts before t=10; 3 at t=10." },
      { key: "d", label: "40 downstream attempts before t=10; 3 at t=10." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-breaker",
          label: "Suppress open-state calls and bound half-open probes.",
          cause:
            "The prediction treats fallback as something produced only after another failed call, or treats the recovery boundary as permission to release all traffic before a probe succeeds.",
          check: (a) => a.picked?.length === 1 && a.picked[0] === "a",
        },
      ],
      expected:
        "The open breaker makes no downstream attempts for the 40 arrivals. At t=10 it permits one recovery probe, not all three requests. The other two receive fallback. A completed successful probe can inform a later transition back to normal traffic.",
      nextStep:
        "Trace the next state for a successful probe and for a failed probe, using an explicit reopen delay.",
    },
    helpLevels: [
      "Count outbound network attempts separately from requests receiving a response.",
      "An open breaker can return a local fallback without occupying a downstream connection.",
      "At the recovery boundary, apply the stated one-probe rule before considering whether normal traffic can resume.",
    ],
  },
  {
    id: "t-11-find-flaw",
    conceptId: 11,
    type: "find-flaw",
    prompt:
      "Which proposed fix addresses both the unbounded wait and the mistaken conclusion about the write? Choose one.",
    context:
      "An inventory client uses Promise.race between an HTTP write and a 500 ms timer. When the timer wins, it reports 'the write failed' but leaves the HTTP operation running. Requests accumulate in the connection pool. The server may have committed a write before its reply was delayed, and the client has an operation ID for checking status.",
    options: [
      { key: "a", label: "Keep the race and raise the connection-pool limit; retain the failure message." },
      {
        key: "b",
        label:
          "Apply the deadline through transport cancellation and resource cleanup; report an unknown outcome and query status by operation ID.",
      },
      {
        key: "c",
        label: "Apply transport cancellation and resource cleanup; report that the server rolled back the write.",
      },
      { key: "d", label: "Keep the HTTP operation running and query status immediately after displaying the timer message." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-deadline",
          label: "Release client resources without claiming remote rollback.",
          cause:
            "The fix confuses stopping the caller's wait with cancelling underlying I/O, or confuses a missing response with proof that a remote write did not commit.",
          check: (a) => a.picked?.length === 1 && a.picked[0] === "b",
        },
      ],
      expected:
        "A timer race alone does not stop the losing HTTP operation. Propagate a deadline to a transport that supports cancellation and cleanup. Even then, client cancellation cannot prove remote rollback: the write outcome may be unknown and should be reconciled using its operation ID.",
      nextStep:
        "Test a server that commits immediately but delays its reply, then verify client cleanup and status reconciliation.",
    },
    helpLevels: [
      "Separate the caller's wait, the client's network resources, and the server's write.",
      "Winning a timer race does not by itself terminate the HTTP operation that lost.",
      "A released client connection still cannot reveal whether the server committed before cancellation arrived.",
    ],
  },
  {
    id: "t-12-compare",
    conceptId: 12,
    type: "compare",
    prompt:
      "Compare the two bounded retry policies and choose one. Both are defensible here; feedback will explain what each gives up.",
    context:
      "A read-only catalog GET sometimes receives a documented transient 503 after 100 ms. The caller has 1,500 ms left. Policy A makes at most one retry after a randomized 100–200 ms delay; that attempt has a 400 ms timeout. Policy B makes at most two retries after randomized delays of 100–200 ms and 200–400 ms; each attempt has a 400 ms timeout. Both enforce the caller's remaining deadline, and load testing shows spare capacity for either policy.",
    options: [
      { key: "a", label: "Deploy policy A." },
      { key: "b", label: "Deploy policy B." },
      { key: "c", label: "Retry every 503 immediately until the caller's deadline expires." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-retry",
          label: "Choose a bounded, paced retry policy for a safe transient failure.",
          cause:
            "The policy uses a time deadline as its only retry bound and removes pacing, allowing a fast-failing dependency to receive a burst of repeated attempts.",
          check: (a) =>
            a.picked?.length === 1 && (a.picked[0] === "a" || a.picked[0] === "b"),
        },
      ],
      validAlternatives: [
        {
          picks: ["a"],
          tradeoff:
            "One retry limits added downstream work and waiting time, but gives a transient fault fewer chances to clear.",
        },
        {
          picks: ["b"],
          tradeoff:
            "Two retries provide another recovery opportunity within the stated remaining budget, but can consume more latency and downstream capacity. Spare capacity must be rechecked during incidents.",
        },
      ],
      expected:
        "Both A and B retry a read-only operation after a documented transient failure, cap attempts, add randomized delays, and honor the overall deadline. A favors lower amplification; B favors another recovery opportunity. Immediate deadline-only retries can amplify an outage.",
      nextStep:
        "Remove the spare-capacity assumption and compare each policy's worst-case downstream attempts per incoming request.",
    },
    helpLevels: [
      "Check operation safety, failure classification, and retry bounds separately.",
      "Both named policies have an attempt cap and pacing; their main difference is additional work versus another chance to recover.",
      "A caller deadline limits elapsed time but does not prevent many rapid attempts when failures return immediately.",
    ],
  },
  {
    id: "t-13-predict",
    conceptId: 13,
    type: "predict",
    prompt:
      "Before running the outage simulation, predict which schedule is less likely to create synchronized retry waves. Choose one.",
    context:
      "Two thousand sensor gateways fail at the same instant. Schedule A waits exactly 1, 2, and 4 seconds between successive retries. Schedule B independently samples each gateway's waits from 0–1, 0–2, and 0–4 seconds respectively. Both allow only three retries, use the same overall deadline, and make no further attempts after it expires. Ignore timer quantization.",
    options: [
      { key: "a", label: "Schedule A is less likely to create synchronized waves." },
      { key: "b", label: "Schedule B is less likely to create synchronized waves." },
      { key: "c", label: "Both schedules produce the same retry timing distribution." },
    ],
    rubric: {
      criteria: [
        {
          key: "choice-jitter",
          label: "Distinguish growing delays from independent desynchronization.",
          cause:
            "The prediction assumes exponential delay growth alone separates clients that failed together, or assumes matching retry caps imply matching arrival patterns.",
          check: (a) => a.picked?.length === 1 && a.picked[0] === "b",
        },
      ],
      expected:
        "A keeps identical clients aligned, with retry waves at approximately t=1, t=3, and t=7. B spreads attempts through independently randomized, growing windows. Jitter reduces synchronization but does not guarantee a maximum instantaneous rate or eliminate the need for attempt and deadline limits.",
      nextStep:
        "Plot attempts per 100 ms bin for both schedules, then add a server-side admission limit to bound accepted work.",
    },
    helpLevels: [
      "All gateways share the same starting instant; compare whether they also share the same subsequent waits.",
      "Increasing a delay changes when a wave happens, but identical delays can preserve the wave.",
      "Independent random samples spread retry times even when every client uses the same growing upper bounds.",
    ],
  },
];
