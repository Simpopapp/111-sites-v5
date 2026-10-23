import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import {
  Zap,
  ShieldAlert,
  BookOpenCheck,
  Lock,
  Radio,
  Gauge,
  ArrowRight,
} from "lucide-react";
import { SANDBOXES, type SandboxId } from "@/lib/simulators";
import { LABS } from "@/lib/labs";
import { getConcept } from "@/lib/concepts";

export const Route = createFileRoute("/sandboxes")({
  validateSearch: (search: Record<string, unknown>): { s?: string | undefined } => ({
    s: typeof search["s"] === "string" ? search["s"] : undefined,
  }),
  // Compat: deep-links antigos ?s=<id> apontam agora para o laboratório focado.
  beforeLoad: ({ search }) => {
    if (search.s && SANDBOXES.some((sb) => sb.id === search.s)) {
      throw redirect({ to: "/labs/$id", params: { id: search.s } });
    }
  },
  head: () => ({
    meta: [
      { title: "Interactive Sandboxes — VibeCoder Academy" },
      {
        name: "description",
        content:
          "Six focused labs: rate limiters, circuit breakers, N+1 queries, SQL injection, queues and tail latency — run them live in your browser.",
      },
      {
        property: "og:title",
        content: "Interactive Sandboxes — VibeCoder Academy",
      },
      {
        property: "og:description",
        content:
          "Six focused labs: rate limiters, circuit breakers, N+1 queries, SQL injection, queues and tail latency — run them live in your browser.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: SandboxesPage,
});

const ICONS: Record<SandboxId, typeof Zap> = {
  ratelimit: Zap,
  circuit: ShieldAlert,
  nplusone: BookOpenCheck,
  sqli: Lock,
  pubsub: Radio,
  tail: Gauge,
};

function SandboxesPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Interactive Sandboxes
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Six focused labs of the production patterns from the guide. Break things here — not in
          production.
        </p>
      </div>

      <div className="mt-10 grid gap-5 sm:grid-cols-2">
        {SANDBOXES.map((meta) => {
          const Icon = ICONS[meta.id];
          const bench = LABS[meta.id];
          return (
            <Link
              key={meta.id}
              to="/labs/$id"
              params={{ id: meta.id }}
              className="group flex flex-col rounded-2xl border border-border/70 bg-card/40 p-5 transition-colors hover:border-primary/40 hover:bg-card/60"
            >
              <div className="mb-3 flex items-center gap-3">
                <div className="flex size-9 items-center justify-center rounded-lg border border-border bg-secondary">
                  <Icon className="size-4 text-primary" />
                </div>
                <div>
                  <span className="block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                    Lab #{meta.num}
                  </span>
                  <h2 className="text-lg font-bold text-foreground">{meta.title}</h2>
                </div>
              </div>

              <p className="mb-3 text-sm text-muted-foreground">{meta.blurb}</p>
              <p className="mb-4 text-xs text-muted-foreground/80">
                <span className="font-semibold text-foreground/70">You will observe: </span>
                {bench.scenario.symptom}
              </p>

              <div className="mt-auto">
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {meta.conceptIds.map((cid) => {
                    const c = getConcept(cid);
                    if (!c) return null;
                    return (
                      <span
                        key={cid}
                        className="rounded-full border border-border/60 bg-secondary/60 px-2.5 py-0.5 font-mono text-xs text-muted-foreground"
                      >
                        #{cid} {c.name}
                      </span>
                    );
                  })}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-bold text-primary transition-transform group-hover:translate-x-0.5">
                  Open focused lab <ArrowRight className="size-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
