import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  Compass,
  ListChecks,
  Target,
} from "lucide-react";
import { CONCEPTS, getConcept } from "@/lib/concepts";
import {
  DIMENSIONS,
  DIMENSION_LABELS,
  DIMENSION_MEANING,
  progressOverview,
} from "@/lib/progress";
import { recommendNext, type Recommendation } from "@/lib/recommend";
import { missionHintsFromLearning } from "@/lib/missions";
import { useLearning } from "@/hooks/use-learning";
import { getTask } from "@/lib/exercises-data";

export const Route = createFileRoute("/progress")({
  head: () => ({
    meta: [
      { title: "Progress — VibeCoder Academy" },
      {
        name: "description",
        content:
          "Honest progress: contact, practice, demonstration, transfer, retention and declared application — each with an explicit denominator, never a single readiness score.",
      },
      { property: "og:title", content: "Progress — VibeCoder Academy" },
      {
        property: "og:description",
        content:
          "Six honest learning dimensions with labeled denominators and inspectable evidence.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ProgressPage,
});

const KIND_BADGE: Record<Recommendation["kind"], string> = {
  review: "Retention",
  "mission-gap": "Mission",
  "route-step": "Route",
  challenge: "Practice",
};

function NextSteps() {
  const { learning } = useLearning();
  const recs = useMemo(
    () => recommendNext(learning, learning.objective?.goal, {
      missionHints: missionHintsFromLearning(learning),
    }),
    [learning],
  );

  return (
    <section className="rounded-2xl border border-primary/30 bg-primary/5 p-5">
      <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
        <Target className="size-4 text-primary" /> What to do next
      </h2>
      {recs.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Open a lesson or try a task — recommendations appear once there is
          activity to build on.
        </p>
      ) : (
        <ul className="space-y-2">
          {recs.map((r, i) => (
            <li key={i}>
              <a
                href={r.href}
                className="block rounded-xl border border-border/60 bg-card/60 p-3 transition-colors hover:border-primary/40"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{r.label}</span>
                  <span className="shrink-0 rounded bg-primary/15 px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-primary">
                    {KIND_BADGE[r.kind]}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{r.reason}</p>
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function DimensionCards() {
  const { learning } = useLearning();
  const overview = useMemo(() => progressOverview(learning), [learning]);

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
        <ListChecks className="size-4 text-primary" /> The six dimensions
      </h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {DIMENSIONS.map((d) => {
          const t = overview.totals[d];
          return (
            <div key={d} className="rounded-xl border border-border/70 bg-card/50 p-4">
              <div className="flex items-baseline justify-between">
                <span className="text-sm font-bold text-foreground">{DIMENSION_LABELS[d]}</span>
                <span className="font-mono text-lg font-extrabold text-foreground">
                  {t.count}
                  <span className="text-xs font-medium text-muted-foreground"> / {t.denominator}</span>
                </span>
              </div>
              <p className="mt-1 text-xs font-medium text-muted-foreground">
                {t.count} of {t.denominatorLabel}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">
                {DIMENSION_MEANING[d]}
              </p>
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
        No global percentage on purpose: a single score would mix consulting a
        page with demonstrating a decision. Declared application lives in{" "}
        <Link to="/readiness" className="font-semibold text-primary underline-offset-2 hover:underline">
          My app
        </Link>{" "}
        — self-declaration, never counted as mastery.
      </p>
    </section>
  );
}

function CategoryTable() {
  const { learning } = useLearning();
  const overview = useMemo(() => progressOverview(learning), [learning]);

  return (
    <section>
      <h2 className="mb-3 font-serif text-lg font-semibold text-foreground">
        By competence (category)
      </h2>
      <div className="overflow-x-auto rounded-xl border border-border/70">
        <table className="w-full min-w-[720px] text-sm">
          <thead>
            <tr className="border-b border-border/60 bg-card/40 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="px-3 py-2 font-semibold">Category</th>
              {DIMENSIONS.map((d) => (
                <th key={d} className="px-3 py-2 font-semibold">
                  {DIMENSION_LABELS[d]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {overview.byCategory.map((row) => (
              <tr key={row.cat} className="border-b border-border/30 last:border-b-0">
                <td className="px-3 py-2 font-semibold text-foreground">
                  {row.cat}
                  <span className="ml-1.5 font-mono text-xs font-normal text-muted-foreground">
                    {row.concepts} concepts
                  </span>
                </td>
                {DIMENSIONS.map((d) => {
                  const s = row.dims[d];
                  return (
                    <td key={d} className="px-3 py-2 font-mono text-xs text-muted-foreground">
                      {s.count}/{s.denominator}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-muted-foreground">
        Denominators match the cut: practice counts only concepts that have
        tasks; transfer and retention only concepts that have variants.
      </p>
    </section>
  );
}

function EvidenceRow({ conceptId }: { conceptId: number }) {
  const { learning } = useLearning();
  const [open, setOpen] = useState(false);
  const overview = useMemo(() => progressOverview(learning), [learning]);
  const concept = getConcept(conceptId);
  const entry = overview.active.find((a) => a.conceptId === conceptId);
  if (!concept || !entry) return null;
  const attempts = learning.attempts.filter((a) => a.conceptId === conceptId);
  const appRec = learning.application[conceptId];

  return (
    <li className="border-b border-border/30 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left"
      >
        <span className="flex min-w-0 items-center gap-2">
          <span className="font-mono text-xs text-primary">#{concept.id}</span>
          <span className="truncate text-sm font-medium text-foreground">{concept.name}</span>
        </span>
        <span className="flex shrink-0 items-center gap-1">
          {DIMENSIONS.map((d) => (
            <span
              key={d}
              title={`${DIMENSION_LABELS[d]}: ${entry.dims[d] ? DIMENSION_MEANING[d] : "no evidence yet"}`}
              className={
                "rounded px-1.5 py-0.5 text-xs font-bold uppercase tracking-wide " +
                (entry.dims[d]
                  ? "bg-success/15 text-success"
                  : "bg-muted text-muted-foreground/60")
              }
            >
              {DIMENSION_LABELS[d].slice(0, 4)}
            </span>
          ))}
          {open ? (
            <ChevronDown className="size-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
        </span>
      </button>
      {open ? (
        <div className="space-y-2 border-t border-border/30 bg-background/40 px-4 py-3">
          {attempts.length === 0 && !appRec ? (
            <p className="text-xs text-muted-foreground">
              Contact only — open the lesson or try a task to build evidence.
            </p>
          ) : null}
          {attempts.map((a, i) => {
            const task = getTask(a.taskId);
            return (
              <div key={i} className="rounded-lg border border-border/50 bg-card/50 p-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs text-primary">{a.taskId}</span>
                  <span className="font-semibold text-foreground">
                    outcome: {a.outcome} · help {a.help}/3
                  </span>
                </div>
                {task ? (
                  <ul className="mt-1.5 space-y-0.5 text-muted-foreground">
                    {task.rubric.criteria.map((c) => (
                      <li key={c.key}>
                        {a.criteria[c.key] ? "✓" : "✗"} {c.label}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            );
          })}
          {appRec ? (
            <p className="rounded-lg border border-accent-2/30 bg-accent-2/10 p-3 text-xs text-foreground/90">
              Declared applied in your app — self-declaration
              {appRec.note ? `: “${appRec.note}”` : ""}
              {appRec.nA ? " · marked “not applicable”" : ""}.
            </p>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

function ActiveConcepts() {
  const { learning } = useLearning();
  const overview = useMemo(() => progressOverview(learning), [learning]);

  if (overview.active.length === 0) {
    return (
      <section className="rounded-2xl border border-border/70 bg-card/40 p-5">
        <h2 className="mb-2 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
          <Compass className="size-4 text-primary" /> Evidence by concept
        </h2>
        <p className="text-sm text-muted-foreground">
          Nothing recorded yet. Open a{" "}
          <Link to="/" className="text-primary underline-offset-2 hover:underline">
            lesson
          </Link>{" "}
          or start from a{" "}
          <Link to="/sandboxes" className="text-primary underline-offset-2 hover:underline">
            lab
          </Link>
          .
        </p>
      </section>
    );
  }

  return (
    <section>
      <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
        <Compass className="size-4 text-primary" /> Evidence by concept
      </h2>
      <ul className="overflow-hidden rounded-xl border border-border/70 bg-card/40">
        {overview.active.map((a) => (
          <EvidenceRow key={a.conceptId} conceptId={a.conceptId} />
        ))}
      </ul>
      <p className="mt-2 text-xs text-muted-foreground">
        {overview.active.length} of {CONCEPTS.length} concepts have any recorded
        activity — click a row to inspect the evidence behind each dimension.
      </p>
    </section>
  );
}

function ProgressPage() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10 sm:px-6">
      <header>
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          Progress
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Six dimensions, each saying what it measures and what it does not.
          What sustains each state is inspectable — decisions, criteria and
          help used, not time on page.
        </p>
      </header>
      <NextSteps />
      <DimensionCards />
      <CategoryTable />
      <ActiveConcepts />
      <footer className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <ArrowRight className="size-3.5" />
        Retention uses a fixed 72 h first interval — a calibration hypothesis,
        stated here instead of being passed off as science.
      </footer>
    </div>
  );
}
