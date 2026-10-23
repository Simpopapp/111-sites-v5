import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Compass,
  FlaskConical,
  History,
  Search,
  Sparkles,
  Target,
  Timer,
} from "lucide-react";
import { CONCEPTS, CONCEPT_CATEGORIES } from "@/lib/concepts";
import { SANDBOXES } from "@/lib/simulators";
import { LABS } from "@/lib/labs";
import { matchSymptoms } from "@/lib/symptoms";
import { hasLesson } from "@/lib/lessons";
import { ConceptCard } from "@/components/concept-card";
import { useLearning } from "@/hooks/use-learning";
import { recommendNext } from "@/lib/recommend";
import { missionHintsFromLearning } from "@/lib/missions";

export const Route = createFileRoute("/")({
  validateSearch: (
    search: Record<string, unknown>,
  ): { q?: string | undefined; cat?: string | undefined } => ({
    q: typeof search["q"] === "string" ? search["q"] : undefined,
    cat: typeof search["cat"] === "string" ? search["cat"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "VibeCoder Academy — production decisions, practiced honestly" },
      {
        name: "description",
        content:
          "Start from a problem or explore the library: 111 production concepts with deep lessons, focused labs and honest progress — no readiness theater.",
      },
      {
        property: "og:title",
        content: "VibeCoder Academy — production decisions, practiced honestly",
      },
      {
        property: "og:description",
        content:
          "Home as a workbench: continue where you stopped, start from a recognizable problem or browse the full library.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const PROBLEM_DOORS = [
  {
    title: "The request didn't finish",
    desc: "Timeout, uncertainty, retries and the invariant that protects the charge.",
    conceptId: 11,
  },
  {
    title: "The page got slow",
    desc: "Round-trips, N+1, cache and the distribution the average hides.",
    conceptId: 27,
  },
  {
    title: "Work is accumulating",
    desc: "Queue, capacity, retry, DLQ — and what a slow consumer really means.",
    conceptId: 15,
  },
] as const;

type TimeBudget = "5" | "15" | "30";

function HomePage() {
  const { q, cat } = Route.useSearch();
  const navigate = Route.useNavigate();
  const { learning, setObjective } = useLearning();

  // A digitação vive em estado local (sem perder caracteres) e é sincronizada
  // com a URL com debounce de 250ms — padrão do Project 1, preservado.
  const [query, setQuery] = useState("");
  const lastSynced = useRef("");

  // Controle honesto de tempo disponível (planejamento §13): sugere uma
  // unidade menor; nunca muda o nível de conhecimento presumido.
  const [timeBudget, setTimeBudget] = useState<TimeBudget>("30");
  const [objectiveDraft, setObjectiveDraft] = useState("");

  const firstAccess =
    Object.keys(learning.contact).length === 0 &&
    learning.attempts.length === 0 &&
    Object.keys(learning.application).length === 0 &&
    Object.keys(learning.missions).length === 0 &&
    learning.objective === undefined;

  const lastContact = useMemo(() => {
    const entries = Object.entries(learning.contact);
    if (!entries.length) return undefined;
    const [id, ts] = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
    return { conceptId: Number(id), ts: ts as number };
  }, [learning.contact]);

  const overdueReviews = useMemo(
    () => learning.reviews.filter((r) => r.doneTs === undefined && r.dueTs <= Date.now()).length,
    [learning.reviews],
  );

  const recs = useMemo(
    () =>
      recommendNext(learning, learning.objective?.goal, {
        missionHints: missionHintsFromLearning(learning),
        limit: timeBudget === "5" ? 1 : 3,
      }),
    [learning, timeBudget],
  );

  const ongoingMissions = useMemo(
    () => Object.entries(learning.missions),
    [learning.missions],
  );

  const symptoms = useMemo(() => matchSymptoms(query), [query]);

  const filtered = useMemo(() => {
    const needle = query.toLowerCase().trim();
    const symptomIds = new Set(symptoms.flatMap((s) => s.conceptIds));
    return CONCEPTS.filter((item) => {
      const matchesCategory = !cat || item.cat === cat;
      const matchesSearch =
        !needle ||
        item.name.toLowerCase().includes(needle) ||
        item.eli.toLowerCase().includes(needle) ||
        String(item.id) === needle ||
        item.cat.toLowerCase().includes(needle) ||
        symptomIds.has(item.id);
      return matchesCategory && matchesSearch;
    });
  }, [query, cat, symptoms]);

  // URL → campo (voltar/avançar, link compartilhado).
  useEffect(() => {
    const fromUrl = q ?? "";
    if (fromUrl !== lastSynced.current) {
      lastSynced.current = fromUrl;
      setQuery(fromUrl);
    }
  }, [q]);

  // Campo → URL (debounce).
  useEffect(() => {
    const t = setTimeout(() => {
      if (query !== lastSynced.current) {
        lastSynced.current = query;
        void navigate({ search: { q: query || undefined, cat }, replace: true });
      }
    }, 250);
    return () => clearTimeout(t);
  }, [query, cat, navigate]);

  return (
    <div className="flex min-h-dvh flex-col bg-background text-foreground">
      {/* HERO */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-6 pt-10 sm:px-6">
        <div className="max-w-3xl border-b border-border/60 pb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <Sparkles className="size-3.5" />
            From recognizing terms to making defensible decisions
          </div>
          <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
            What vibe coding doesn't teach you{" "}
            <span className="text-primary">until production asks for evidence.</span>
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            111 concepts with deep lessons and focused labs. Progress here is
            decisions made and justified — not pages visited, not checklists.
          </p>
        </div>
      </section>

      {/* WORKBENCH — primeiro acesso vs retorno (PRD project2 F6) */}
      <section className="mx-auto w-full max-w-7xl px-4 sm:px-6">
        {firstAccess ? (
          <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
              <Compass className="size-4 text-primary" /> Start by choosing a door
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {PROBLEM_DOORS.map((door) => (
                <Link
                  key={door.conceptId}
                  to="/concepts/$id"
                  params={{ id: String(door.conceptId) }}
                  className="rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="text-sm font-bold text-foreground">{door.title}</div>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{door.desc}</p>
                  <p className="mt-2 text-xs font-semibold text-primary">
                    Open the problem →
                  </p>
                </Link>
              ))}
            </div>
            <Link
              to="/missions/$slug"
              params={{ slug: "charged-but-lost" }}
              className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 transition-colors hover:border-primary/50"
            >
              <div>
                <div className="text-xs font-bold uppercase tracking-wide text-primary">
                  Guided start — mission
                </div>
                <div className="mt-1 text-sm font-bold text-foreground">
                  The charge went through, but the answer got lost
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Predict, experiment, decide and write the dossier — the full learning cycle in one mission.
                </p>
              </div>
              <ArrowRight className="size-4 shrink-0 text-primary" />
            </Link>
            <div className="mt-4 flex flex-wrap items-center gap-3 text-xs">
              <a
                href="#grid"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3.5 py-2 font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <BookOpen className="size-4 text-primary" /> Explore the library instead
              </a>
              <Link
                to="/sandboxes"
                search={{}}
                className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3.5 py-2 font-semibold text-foreground transition-colors hover:bg-accent"
              >
                <FlaskConical className="size-4 text-primary" /> Go straight to the labs
              </Link>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl border border-border/70 bg-card/40 p-5">
            <h2 className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
              <History className="size-4 text-primary" /> Pick up where you stopped
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
              {lastContact ? (
                <Link
                  to="/concepts/$id"
                  params={{ id: String(lastContact.conceptId) }}
                  className="rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Lesson in progress
                  </div>
                  <div className="mt-1 text-sm font-bold text-foreground">
                    #{lastContact.conceptId} {CONCEPTS.find((c) => c.id === lastContact.conceptId)?.name}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Last opened{" "}
                    {new Date(lastContact.ts).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
                    {hasLesson(lastContact.conceptId) ? "deep lesson" : "quick reference"}
                  </p>
                </Link>
              ) : (
                <Link
                  to="/"
                  search={{}}
                  className="rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="text-sm font-bold text-foreground">Open a lesson</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    The library is below — or start from a problem.
                  </p>
                </Link>
              )}
              {overdueReviews > 0 ? (
                <Link
                  to="/progress"
                  search={{}}
                  className="rounded-xl border border-warning/40 bg-warning/5 p-4 transition-colors hover:border-warning/60"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-warning">
                    Review due
                  </div>
                  <div className="mt-1 text-sm font-bold text-foreground">
                    {overdueReviews} scheduled {overdueReviews === 1 ? "recovery" : "recoveries"}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Retelling after the interval is the retention evidence.
                  </p>
                </Link>
              ) : (
                <Link
                  to="/sandboxes"
                  search={{}}
                  className="rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="text-sm font-bold text-foreground">Run an experiment</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Predict before you look — the labs are built for it.
                  </p>
                </Link>
              )}
              {ongoingMissions.length > 0 ? (
                <a
                  href={`/missions/${ongoingMissions[0]![0]}`}
                  className="rounded-xl border border-primary/30 bg-primary/5 p-4 transition-colors hover:border-primary/50"
                >
                  <div className="text-xs font-bold uppercase tracking-wider text-primary">
                    Mission in progress
                  </div>
                  <div className="mt-1 text-sm font-bold text-foreground">
                    {ongoingMissions[0]![1].step}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">Continue the mission →</p>
                </a>
              ) : (
                <Link
                  to="/progress"
                  search={{}}
                  className="rounded-xl border border-border/60 bg-background/50 p-4 transition-colors hover:border-primary/40"
                >
                  <div className="text-sm font-bold text-foreground">See your progress</div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Six honest dimensions with labeled denominators.
                  </p>
                </Link>
              )}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-border/50 pt-4">
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  setObjective(objectiveDraft.trim() || null);
                }}
              >
                <label htmlFor="objective" className="text-xs font-semibold text-muted-foreground">
                  My objective:
                </label>
                <input
                  id="objective"
                  type="text"
                  defaultValue={learning.objective?.goal ?? ""}
                  onChange={(e) => setObjectiveDraft(e.target.value)}
                  placeholder="e.g. stop losing charges on retry"
                  className="w-56 rounded-lg border border-border/60 bg-background/60 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-border bg-secondary px-2.5 py-1.5 text-xs font-semibold text-foreground transition-colors hover:bg-accent"
                >
                  Save
                </button>
                {learning.objective ? (
                  <button
                    type="button"
                    onClick={() => {
                      setObjective(null);
                      setObjectiveDraft("");
                    }}
                    className="text-xs text-muted-foreground underline-offset-2 hover:underline"
                  >
                    clear
                  </button>
                ) : null}
              </form>
              <div className="flex items-center gap-1.5">
                <Timer className="size-3.5 text-muted-foreground" />
                <span className="text-xs font-semibold text-muted-foreground">Time available:</span>
                {(["5", "15", "30"] as TimeBudget[]).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTimeBudget(t)}
                    aria-pressed={timeBudget === t}
                    className={
                      "rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors " +
                      (timeBudget === t
                        ? "border-primary/50 bg-primary/15 text-primary"
                        : "border-border/60 bg-secondary/60 text-muted-foreground hover:text-foreground")
                    }
                  >
                    {t} min
                  </button>
                ))}
              </div>
            </div>
            <div className="mt-4 space-y-2 border-t border-border/50 pt-4">
              <p className="flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
                <Target className="size-4 text-primary" /> What to do next
              </p>
              {recs.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Try a task or open a lab — suggestions appear with activity.
                </p>
              ) : (
                <ul className="flex flex-col gap-2 md:flex-row">
                  {recs.map((r, i) => (
                    <li key={i} className="flex-1">
                      <a
                        href={r.href}
                        className="block rounded-xl border border-border/60 bg-background/50 p-3 transition-colors hover:border-primary/40"
                      >
                        <div className="text-xs font-bold text-foreground">{r.label}</div>
                        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                          {r.reason}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {timeBudget === "5" ? (
                <p className="text-xs text-muted-foreground">
                  5 minutes: one smaller unit suggested — your level isn't being judged.
                </p>
              ) : null}
            </div>
          </div>
        )}
      </section>

      {/* SEARCH & FILTERS */}
      <section className="mx-auto w-full max-w-7xl px-4 pt-6 sm:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, symptom or number (e.g. 'queue grows', 'P99', 'N+1')..."
              aria-label="Search concepts and symptoms"
              className="w-full rounded-xl border border-border bg-card py-2 pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-primary focus:ring-1 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(["All", ...CONCEPT_CATEGORIES] as string[]).map((label) => {
              const isActive = label === "All" ? !cat : cat === label;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() =>
                    void navigate({
                      search: { q: query || undefined, cat: label === "All" ? undefined : label },
                      replace: true,
                    })
                  }
                  className={
                    "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
                    (isActive
                      ? "border-primary/50 bg-primary/15 text-primary"
                      : "border-border/60 bg-secondary/60 text-muted-foreground hover:text-foreground")
                  }
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Correspondência por sintoma: explica o motivo (planejamento §9.2) */}
        {symptoms.length > 0 ? (
          <div className="mt-4 rounded-xl border border-info/30 bg-info/5 p-3">
            <p className="text-xs font-bold uppercase tracking-wider text-info">
              Matched by symptom
            </p>
            {symptoms.slice(0, 2).map((s, i) => (
              <div key={i} className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <span className="text-foreground/90">{s.lead}</span>
                {s.labId ? (
                  <Link
                    to="/labs/$id"
                    params={{ id: s.labId }}
                    className="font-semibold text-info underline-offset-2 hover:underline"
                  >
                    Open the {LABS[s.labId].title} lab →
                  </Link>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </section>

      {/* GRID */}
      <main id="grid" className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <div className="mb-4 flex items-center justify-between px-1 text-xs text-muted-foreground">
          <span>
            Showing {filtered.length} of {CONCEPTS.length} items
          </span>
          <span className="hidden sm:inline">
            Cards show the problem first — the decision comes in the lesson.
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-border/70 bg-card/40 py-12 text-center">
            <Compass className="mx-auto mb-3 size-10 opacity-50" />
            <p className="text-sm font-semibold text-foreground">
              Nothing matches “{query}”{cat ? ` in ${cat}` : ""}.
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  void navigate({ search: { cat: undefined }, replace: true });
                }}
                className="rounded-xl border border-border bg-secondary px-3.5 py-2 font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Clear the search
              </button>
              <button
                type="button"
                onClick={() => {
                  setQuery("queue grows");
                }}
                className="rounded-xl border border-border bg-secondary px-3.5 py-2 font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Search by a symptom instead
              </button>
              <Link
                to="/sandboxes"
                search={{}}
                className="rounded-xl border border-border bg-secondary px-3.5 py-2 font-semibold text-foreground transition-colors hover:bg-accent"
              >
                Try a lab
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => (
              <ConceptCard key={item.id} concept={item} />
            ))}
          </div>
        )}
      </main>

      {/* LAB TEASERS — fenômeno observável + decisão praticada (F6) */}
      <section className="mx-auto w-full max-w-7xl px-4 pb-12 sm:px-6">
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-foreground">
          <FlaskConical className="size-4 text-primary" />
          Focused labs — observe a phenomenon, practice a decision
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {SANDBOXES.map((meta) => {
            const bench = LABS[meta.id];
            return (
              <Link
                key={meta.id}
                to="/labs/$id"
                params={{ id: meta.id }}
                className="flex flex-col rounded-xl border border-border/70 bg-card/50 p-4 transition-colors hover:border-primary/40 hover:bg-card"
              >
                <div className="text-sm font-bold text-foreground">{bench.title}</div>
                <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">
                  Phenomenon: {bench.scenario.symptom}
                </p>
                <p className="mt-2 line-clamp-2 text-xs font-semibold text-primary">
                  Practice: {bench.evidence[0]}
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
        An applied-learning atelier for people who ship software with AI — progress
        measured in decisions, not checklists.
      </footer>
    </div>
  );
}
