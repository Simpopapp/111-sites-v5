import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CheckCircle2, Circle, CircleOff, Info } from "lucide-react";
import { CONCEPTS, CONCEPT_CATEGORIES } from "@/lib/concepts";
import { useLearning } from "@/hooks/use-learning";
import type { ApplicationRecord } from "@/lib/learning";

export const Route = createFileRoute("/readiness")({
  head: () => ({
    meta: [
      { title: "My App — Application Record — VibeCoder Academy" },
      {
        name: "description",
        content:
          "Register which patterns your app already implements — with notes and a “not applicable” option. Self-declaration, never counted as mastery.",
      },
      {
        property: "og:title",
        content: "My App — Application Record — VibeCoder Academy",
      },
      {
        property: "og:description",
        content:
          "A separate record for declared application in your own project — kept apart from demonstrated learning.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ApplicationRecordPage,
});

type Filter = "all" | "declared" | "na" | "pending";

/**
 * Registro de aplicação (PRD project2 D5/D9, planejamento §9.8): o checklist
 * legado renomeado editorialmente. Autodeclaração com contexto opcional e
 * “não se aplica” — separada da prática e do progresso (nunca soma como
 * evidência de aprendizagem, PRD §11).
 */
function ApplicationRecordPage() {
  const { learning, setApplication } = useLearning();
  const [filter, setFilter] = useState<Filter>("all");
  const [category, setCategory] = useState<string>("All");

  const declared = useMemo(
    () =>
      Object.entries(learning.application).filter(([, r]) => !r.nA).length,
    [learning.application],
  );
  const notApplicable = useMemo(
    () => Object.entries(learning.application).filter(([, r]) => r.nA).length,
    [learning.application],
  );

  const groups = useMemo(() => {
    return CONCEPT_CATEGORIES.map((cat) => ({
      cat,
      items: CONCEPTS.filter((c) => {
        if (c.cat !== cat) return false;
        const rec = learning.application[c.id];
        if (filter === "declared") return rec !== undefined && !rec.nA;
        if (filter === "na") return rec?.nA === true;
        if (filter === "pending") return rec === undefined;
        return true;
      }),
    })).filter((g) => g.items.length > 0);
  }, [learning.application, filter]);

  const filters: { value: Filter; label: string }[] = [
    { value: "all", label: "All" },
    { value: "declared", label: "Declared" },
    { value: "na", label: "Not applicable" },
    { value: "pending", label: "Pending" },
  ];

  // Construção explícita (exactOptionalPropertyTypes): undefined nunca é
  // escrito no registro; campo ausente significa "sem nota"/"aplica".
  const setRecord = (
    id: number,
    current: ApplicationRecord | undefined,
    patch: { nA?: boolean | undefined; note?: string | undefined },
  ) => {
    const next: ApplicationRecord = { ts: current?.ts ?? Date.now() };
    if (current?.note !== undefined) next.note = current.note;
    if (current?.nA !== undefined) next.nA = current.nA;
    if (patch.nA !== undefined) next.nA = patch.nA;
    if (patch.note !== undefined) next.note = patch.note;
    setApplication(id, next);
  };

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <header className="text-center">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          My app — application record
        </h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Register what your own project already implements. This is{" "}
          <span className="font-semibold text-foreground">self-declaration</span>:
          it lives apart from the learning dimensions and is never counted as
          mastery. Saved on this device.
        </p>
      </header>

      <div className="mx-auto mt-6 flex max-w-md items-start gap-2 rounded-xl border border-accent-2/30 bg-accent-2/10 p-3 text-xs leading-relaxed text-foreground/90">
        <Info className="mt-0.5 size-4 shrink-0 text-info" />
        <span>
          Marking a pattern here says “my app has it”. It says nothing about
          whether you can explain, decide or transfer it — that evidence lives
          in{" "}
          <Link to="/progress" className="font-semibold text-info underline-offset-2 hover:underline">
            Progress
          </Link>
          .
        </span>
      </div>

      <div className="mt-6 text-center font-mono text-sm text-muted-foreground">
        {declared} of {CONCEPTS.length} declared · {notApplicable} not applicable
      </div>

      {/* Filters */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            type="button"
            onClick={() => setFilter(f.value)}
            className={
              "rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-colors " +
              (filter === f.value
                ? "border-primary/50 bg-primary/15 text-primary"
                : "border-border/60 bg-secondary/60 text-muted-foreground hover:text-foreground")
            }
          >
            {f.label}
          </button>
        ))}
        <span className="mx-1 hidden h-5 w-px bg-border sm:block" />
        {["All", ...CONCEPT_CATEGORIES].map((label) => (
          <button
            key={label}
            type="button"
            onClick={() => setCategory(label)}
            className={
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors " +
              (category === label
                ? "border-info/50 bg-info/10 text-info"
                : "border-border/60 bg-secondary/60 text-muted-foreground hover:text-foreground")
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* Record grouped by category */}
      <div className="mt-8 space-y-8">
        {groups.map((group) =>
          category !== "All" && group.cat !== category ? null : (
            <section key={group.cat}>
              <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
                {group.cat}
                <span className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-foreground/70">
                  {group.items.filter((i) => learning.application[i.id]).length}/
                  {group.items.length}
                </span>
              </h2>
              <ul className="overflow-hidden rounded-xl border border-border/70 bg-card/40">
                {group.items.map((item) => {
                  const rec = learning.application[item.id];
                  const isDeclared = rec !== undefined && !rec.nA;
                  const isNA = rec?.nA === true;
                  return (
                    <li
                      key={item.id}
                      className="border-b border-border/40 px-4 py-2.5 last:border-b-0"
                    >
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() =>
                            isDeclared || isNA
                              ? setApplication(item.id, null)
                              : setApplication(item.id, { ts: Date.now() })
                          }
                          aria-label={
                            isDeclared || isNA
                              ? `Remove the record for ${item.name}`
                              : `Record ${item.name} as implemented in your app`
                          }
                          className={
                            "rounded p-0.5 transition-colors " +
                            (isDeclared
                              ? "text-success"
                              : isNA
                                ? "text-warning"
                                : "text-muted-foreground/50 hover:text-foreground")
                          }
                        >
                          {isDeclared ? (
                            <CheckCircle2 className="size-5" />
                          ) : isNA ? (
                            <CircleOff className="size-5" />
                          ) : (
                            <Circle className="size-5" />
                          )}
                        </button>
                        <span className="font-mono text-xs text-primary">#{item.id}</span>
                        <Link
                          to="/concepts/$id"
                          params={{ id: String(item.id) }}
                          className={
                            "flex-1 text-sm underline-offset-2 hover:underline " +
                            (isDeclared
                              ? "text-foreground"
                              : isNA
                                ? "text-muted-foreground"
                                : "text-foreground")
                          }
                        >
                          {item.name}
                          {isNA ? (
                            <span className="ml-2 text-xs text-warning">not applicable</span>
                          ) : null}
                        </Link>
                        {isDeclared ? (
                          <button
                            type="button"
                            onClick={() => setRecord(item.id, rec, { nA: true })}
                            className="shrink-0 rounded-full border border-border/60 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                          >
                            Doesn't apply to my app
                          </button>
                        ) : isNA ? (
                          <button
                            type="button"
                            onClick={() => setRecord(item.id, rec, { nA: false })}
                            className="shrink-0 rounded-full border border-border/60 px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                          >
                            It does apply
                          </button>
                        ) : null}
                      </div>
                      {isDeclared ? (
                        <input
                          type="text"
                          defaultValue={rec?.note ?? ""}
                          placeholder="Optional context — where does your app use it?"
                          aria-label={`Context for ${item.name}`}
                          onBlur={(e) =>
                            setRecord(item.id, rec, { note: e.target.value.trim() || undefined })
                          }
                          className="mt-2 ml-8 w-[calc(100%-2rem)] rounded-lg border border-border/50 bg-background/60 px-2.5 py-1.5 text-xs text-foreground placeholder:text-muted-foreground/60 focus:border-primary focus:outline-none"
                        />
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </section>
          ),
        )}
      </div>
    </div>
  );
}
