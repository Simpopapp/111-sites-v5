import { useEffect } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, CircleOff, Info, Lock } from "lucide-react";
import { getConcept, CONCEPTS } from "@/lib/concepts";
import { getRelatedSandbox } from "@/lib/simulators";
import { useLearning } from "@/hooks/use-learning";
import { getLesson, hasLesson } from "@/lib/lessons";
import { LessonView } from "@/components/lesson/lesson-view";

export const Route = createFileRoute("/concepts/$id")({
  beforeLoad: ({ params }) => {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id < 1 || id > CONCEPTS.length || !getConcept(id)) {
      throw notFound();
    }
  },
  head: ({ params }) => {
    const concept = getConcept(Number(params.id));
    const title = concept
      ? `#${concept.id} ${concept.name} — 111 Production Essentials`
      : "Concept — 111 Production Essentials";
    const description = concept
      ? `${concept.eli.slice(0, 150)}`
      : "A production architecture essential explained like you're 10.";
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
  component: ConceptDetailPage,
});

function ConceptDetailPage() {
  const { id } = Route.useParams();
  const conceptId = Number(id);
  const concept = getConcept(conceptId)!;
  const prev = getConcept(conceptId - 1);
  const next = getConcept(conceptId + 1);
  const { learning, setApplication, markContact } = useLearning();
  const record = learning.application[concept.id];
  const implemented = record !== undefined && !record.nA;
  const notApplicable = record?.nA === true;

  // Contato (D9): registrar a visita — o LessonView já marca para lições
  // completas; aqui cobre também os blocos legados.
  useEffect(() => {
    markContact(concept.id);
  }, [concept.id, markContact]);
  const relatedSandbox = getRelatedSandbox(concept.id);
  const lesson = hasLesson(concept.id) ? getLesson(concept.id) : undefined;

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <span className="rounded border border-primary/30 bg-primary/10 px-2 py-0.5 font-mono text-xs font-bold text-primary">
            Concept #{concept.id}
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {concept.cat}
          </span>
        </div>
        <Link
          to="/"
          search={{}}
          className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-accent"
        >
          <ArrowLeft className="size-3.5" /> All concepts
        </Link>
      </div>

      <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-foreground">
        {concept.name}
      </h1>

      {lesson ? (
        <LessonView lesson={lesson} conceptId={concept.id} />
      ) : (
        <div className="mt-6 space-y-4">
          <div className="rounded-xl border border-border/60 bg-card/40 p-3 text-xs leading-relaxed text-muted-foreground">
            <span className="inline-flex items-center gap-1.5 font-semibold text-foreground">
              <Info className="size-3.5" /> Honest coverage note:
            </span>{" "}
            this lesson does not have the deep version yet — the classic summary below remains
            valid as a quick reference.
          </div>
          {/* Blocos legados sobre papel (planejamento §15.2 / PRD D12): cor no
              ícone, texto em ink — a cor deixa de rotular o bloco. */}
          <section className="prose-paper rounded-xl border-l-4 border-l-primary p-4">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <span className="text-primary">
                <Info className="inline size-3.5" />
              </span>
              Like you're 10 years old (ELI10)
            </h4>
            <p className="text-sm leading-relaxed text-ink">{concept.eli}</p>
          </section>

          <section className="prose-paper rounded-xl border-l-4 border-l-destructive p-4">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <span className="text-destructive">
                <Info className="inline size-3.5" />
              </span>
              Why vibe coders break it in production
            </h4>
            <p className="text-sm leading-relaxed text-ink">{concept.risk}</p>
          </section>

          <section className="prose-paper rounded-xl border-l-4 border-l-success p-4">
            <h4 className="mb-1.5 flex items-center gap-1.5 text-sm font-semibold text-ink">
              <span className="text-success">
                <Info className="inline size-3.5" />
              </span>
              Production architectural solution
            </h4>
            <p className="text-sm leading-relaxed text-ink">{concept.fix}</p>
          </section>
        </div>
      )}

      {relatedSandbox ? (
        <div className="mt-6 rounded-xl border border-accent-2/30 bg-accent-2/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-xs uppercase tracking-wide text-muted-foreground">
                See it in action
              </span>
              <div className="text-sm font-bold text-foreground">
                Interactive Sandbox #{relatedSandbox.num}: {relatedSandbox.title}
              </div>
            </div>
            <Link
              to="/labs/$id"
              params={{ id: relatedSandbox.id }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-accent-2 px-3 py-2 text-xs font-semibold text-accent-2-foreground transition-transform active:scale-95"
            >
              Open lab <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      ) : null}

      {/* Actions */}
      <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-border/60 pt-4">
        <div>
          <button
            type="button"
            onClick={() =>
              implemented || notApplicable
                ? setApplication(concept.id, null)
                : setApplication(concept.id, { ts: Date.now() })
            }
            className={
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-colors " +
              (implemented
                ? "bg-success text-success-foreground"
                : notApplicable
                  ? "bg-warning text-warning-foreground"
                  : "bg-secondary text-foreground hover:bg-accent")
            }
            title="Application record: self-declaration about your own app — never counted as learning evidence"
          >
            {implemented ? (
              <CheckCircle2 className="size-4" />
            ) : notApplicable ? (
              <CircleOff className="size-4" />
            ) : (
              <Circle className="size-4" />
            )}
            {implemented
              ? "Recorded in my app"
              : notApplicable
                ? "Not applicable to my app"
                : "Record in my app"}
          </button>
          <p className="mt-1.5 text-xs text-muted-foreground">
            Application record — self-declaration, kept apart from practice and
            progress. Manage notes in{" "}
            <Link to="/readiness" className="text-primary underline-offset-2 hover:underline">
              My app
            </Link>
            .
          </p>
        </div>

        <div className="flex items-center gap-2">
          {prev ? (
            <Link
              to="/concepts/$id"
              params={{ id: String(prev.id) }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              <ArrowLeft className="size-3.5" /> #{prev.id}
            </Link>
          ) : null}
          {next ? (
            <Link
              to="/concepts/$id"
              params={{ id: String(next.id) }}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-accent"
            >
              #{next.id} <ArrowRight className="size-3.5" />
            </Link>
          ) : null}
        </div>
      </div>

      <p className="mt-10 flex items-center justify-center gap-1.5 text-center text-xs text-muted-foreground">
        <Lock className="size-3" /> #{concept.id} of 111 production essentials · VibeCoder
        Academy
      </p>
    </div>
  );
}
