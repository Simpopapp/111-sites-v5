import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, FlaskConical, Lightbulb, ListChecks, ScrollText, Target } from "lucide-react";
import { SANDBOXES, type SandboxId } from "@/lib/simulators";
import { LABS } from "@/lib/labs";
import { getConcept } from "@/lib/concepts";
import { RequestFlowInstrument } from "@/components/instruments/request-flow";
import { StateMachineInstrument } from "@/components/instruments/state-machine";
import { LatencyHistogramInstrument } from "@/components/instruments/latency-histogram";
import { RateLimiterSandbox } from "@/components/sandboxes/rate-limiter";
import { CircuitBreakerSandbox } from "@/components/sandboxes/circuit-breaker";
import { NPlusOneSandbox } from "@/components/sandboxes/n-plus-one";
import { SqlInjectionSandbox } from "@/components/sandboxes/sql-injection";
import { PubSubQueueSandbox } from "@/components/sandboxes/pubsub-queue";
import { TailLatencySandbox } from "@/components/sandboxes/tail-latency";

const isSandboxId = (v: string): v is SandboxId => SANDBOXES.some((s) => s.id === v);

const COMPONENTS: Record<SandboxId, () => React.JSX.Element> = {
  ratelimit: RateLimiterSandbox,
  circuit: CircuitBreakerSandbox,
  nplusone: NPlusOneSandbox,
  sqli: SqlInjectionSandbox,
  pubsub: PubSubQueueSandbox,
  tail: TailLatencySandbox,
};

export const Route = createFileRoute("/labs/$id")({
  beforeLoad: ({ params }) => {
    if (!isSandboxId(params.id)) throw notFound();
  },
  head: ({ params }) => {
    const meta = isSandboxId(params.id) ? SANDBOXES.find((s) => s.id === params.id) : undefined;
    const title = meta ? `${meta.title} Lab — VibeCoder Academy` : "Lab — VibeCoder Academy";
    const description = meta?.blurb ?? "Interactive production lab.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: LabPage,
});

function SectionTitle({ icon: Icon, children }: { icon: typeof Target; children: React.ReactNode }) {
  return (
    <h2 className="mb-2 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
      <Icon className="size-4 text-primary" />
      {children}
    </h2>
  );
}

function LabPage() {
  const { id } = Route.useParams();
  if (!isSandboxId(id)) throw notFound();
  const bench = LABS[id];
  const meta = SANDBOXES.find((s) => s.id === id)!;
  const Sandbox = COMPONENTS[id];
  const inst = bench.instrument;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        to="/sandboxes"
        className="mb-6 inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-primary"
      >
        <ArrowLeft className="size-3.5" />
        All labs
      </Link>

      <header className="mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Interactive Lab #{meta.num}
        </span>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {bench.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{meta.blurb}</p>
      </header>

      <section className="mb-8 rounded-2xl border border-border/70 bg-card/40 p-5">
        <SectionTitle icon={ScrollText}>Scenario</SectionTitle>
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-semibold text-foreground">System</dt>
            <dd className="text-muted-foreground">{bench.scenario.system}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Data / mechanism</dt>
            <dd className="text-muted-foreground">{bench.scenario.data}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Symptom</dt>
            <dd className="text-muted-foreground">{bench.scenario.symptom}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Baseline</dt>
            <dd className="text-muted-foreground">{bench.scenario.baseline}</dd>
          </div>
        </dl>
      </section>

      <section className="mb-8 rounded-2xl border border-border/70 bg-card/40 p-5">
        <SectionTitle icon={FlaskConical}>Controls — run the experiment</SectionTitle>
        <Sandbox key={id} />
      </section>

      <section className="mb-8 rounded-2xl border border-border/70 bg-card/40 p-5">
        <SectionTitle icon={Target}>Representation — what to observe</SectionTitle>
        <p className="mb-4 text-sm text-muted-foreground">{inst.caption}</p>
        {inst.kind === "request-flow" ? <RequestFlowInstrument data={inst.data as never} /> : null}
        {inst.kind === "state-machine" ? <StateMachineInstrument data={inst.data as never} /> : null}
        {inst.kind === "latency-histogram" ? (
          <LatencyHistogramInstrument data={inst.data as never} />
        ) : null}
      </section>

      <section className="mb-8 rounded-2xl border border-border/70 bg-card/40 p-5">
        <SectionTitle icon={ListChecks}>Evidence — check yourself</SectionTitle>
        <ul className="space-y-2 text-sm text-muted-foreground">
          {bench.evidence.map((e, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-mono text-primary">□</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-8 rounded-2xl border border-border/70 bg-card/40 p-5">
        <SectionTitle icon={Lightbulb}>Interpretation</SectionTitle>
        <p className="text-sm leading-relaxed text-foreground/90">{bench.interpretation}</p>
      </section>

      <section className="mb-8 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <SectionTitle icon={Target}>Challenge</SectionTitle>
        <p className="text-sm font-medium text-foreground">{bench.challenge}</p>
      </section>

      <div className="flex flex-wrap items-center gap-2 border-t border-border/50 pt-4">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          Learn the theory:
        </span>
        {meta.conceptIds.map((cid) => {
          const c = getConcept(cid);
          if (!c) return null;
          return (
            <Link
              key={cid}
              to="/concepts/$id"
              params={{ id: String(cid) }}
              className="rounded-full border border-border/60 bg-secondary/60 px-2.5 py-0.5 font-mono text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              #{cid} {c.name}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
