// Aula v2 (PRD project2 D1/D2/D6/D8 / pacote s5-aula). Render em camadas:
// quando o conceito tem lição, esta visão substitui os blocos legados.
// Toda representação tem equivalente textual (a11y, D13); instrumentos
// event-track/table ainda não têm renderizador — o texto equivalente é
// exibido honestamente como tal (nada fingido, D2).

import { useEffect, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  CircleSlash2,
  FlaskConical,
  HelpCircle,
  ListChecks,
  Repeat,
  ScrollText,
  Target,
  XCircle,
} from "lucide-react";
import type { Lesson } from "@/lib/lessons/types";
import { evaluate, type Answer, type Task } from "@/lib/exercises";
import { getTask } from "@/lib/exercises-data";
import { useLearning } from "@/hooks/use-learning";
import { LessonRepresentation } from "@/components/lesson/representation";

function Section({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof BookOpen;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-8 rounded-2xl border border-border/70 bg-card/40 p-5">
      <h2 className="mb-3 flex items-center gap-2 font-serif text-lg font-semibold text-foreground">
        <Icon className="size-4 text-primary" />
        {title}
      </h2>
      {children}
    </section>
  );
}

function RepresentationBlock({ lesson }: { lesson: Lesson }) {
  const { kind, caption, textEquivalent } = lesson.representation;
  return (
    <Section icon={FlaskConical} title="Representation — what to observe">
      <p className="mb-4 text-sm text-muted-foreground">{caption}</p>
      <LessonRepresentation lesson={lesson} />
      <div className="mt-4 rounded-lg border border-border/60 bg-background/60 p-3">
        <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Text equivalent
        </p>
        <p className="text-sm leading-relaxed text-foreground/90">{textEquivalent}</p>
      </div>
      {kind === "event-track" || kind === "table" || kind === "query-explainer" ? (
        <p className="mt-3 text-xs text-muted-foreground">
          This representation has no interactive renderer yet — the text above is the
          complete rendition, not a placeholder summary.
        </p>
      ) : null}
    </Section>
  );
}

/** Tarefa de prática interativa (motor D8; feedback diagnóstico, §9.7). */
function PracticeTask({ task }: { task: Task }) {
  const [picked, setPicked] = useState<string[]>([]);
  const [order, setOrder] = useState<string[]>([]);
  const [helpLevel, setHelpLevel] = useState(0);
  const [submitted, setSubmitted] = useState<ReturnType<typeof evaluate> | null>(null);
  const isOrder = task.type === "order";
  const record = useAttemptRecorder();

  const answer: Answer = isOrder ? { order } : { picked };

  const submit = () => {
    const result = evaluate(task, answer, helpLevel);
    setSubmitted(result);
    record(task, result, helpLevel);
  };

  const togglePick = (key: string) => {
    if (submitted) return;
    setPicked((prev) => (prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]));
  };

  const appendOrder = (key: string) => {
    if (submitted) return;
    setOrder((prev) => (prev.includes(key) ? prev : [...prev, key]));
  };

  const removeOrderAt = (index: number) => {
    if (submitted) return;
    setOrder((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mb-6 rounded-xl border border-border/60 bg-background/50 p-4">
      <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
        Practice · {task.type} · {task.id}
      </p>
      <p className="mb-2 text-sm font-semibold text-foreground">{task.prompt}</p>
      {task.context ? (
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">{task.context}</p>
      ) : null}

      <div className="mb-3 flex flex-col gap-2">
        {task.options?.map((o) => {
          const chosen = isOrder
            ? order.includes(o.key)
            : picked.includes(o.key);
          const orderIndex = order.indexOf(o.key);
          return (
            <button
              key={o.key}
              type="button"
              onClick={isOrder ? () => appendOrder(o.key) : () => togglePick(o.key)}
              className={
                "flex items-start gap-2 rounded-lg border px-3 py-2 text-left text-sm transition-colors " +
                (chosen
                  ? "border-primary/50 bg-primary/10 text-foreground"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:border-primary/30 hover:text-foreground")
              }
            >
              <span className="mt-0.5 font-mono text-xs text-primary">
                {isOrder && orderIndex >= 0 ? `${orderIndex + 1}` : "○"}
              </span>
              <span>{o.label}</span>
            </button>
          );
        })}
      </div>

      {isOrder && order.length ? (
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Your order:
          </span>
          {order.map((key, i) => (
            <button
              key={`${key}-${i}`}
              type="button"
              onClick={() => removeOrderAt(i)}
              className="rounded-full border border-primary/40 bg-primary/10 px-2.5 py-0.5 font-mono text-xs text-foreground"
            >
              {i + 1}. {task.options?.find((o) => o.key === key)?.label.slice(0, 28)}… ✕
            </button>
          ))}
        </div>
      ) : null}

      {!submitted ? (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={submit}
            disabled={isOrder ? order.length === 0 : picked.length === 0}
            className="rounded-xl bg-primary px-4 py-2 text-xs font-bold text-primary-foreground transition-transform active:scale-95 disabled:opacity-40"
          >
            Submit decision
          </button>
          {helpLevel < 3 ? (
            <button
              type="button"
              onClick={() => setHelpLevel((h) => (h + 1) as 1 | 2 | 3)}
              className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-secondary px-3 py-2 text-xs text-foreground transition-colors hover:bg-accent"
            >
              <HelpCircle className="size-3.5" /> Help ({helpLevel}/3)
            </button>
          ) : null}
        </div>
      ) : null}

      {helpLevel > 0 && !submitted ? (
        <div className="mt-3 rounded-lg border border-border/60 bg-card/60 p-3 text-sm text-muted-foreground">
          {task.helpLevels.slice(0, helpLevel).map((h, i) => (
            <p key={i} className="mb-1">
              {h}
            </p>
          ))}
        </div>
      ) : null}

      {submitted ? (
        <div className="space-y-3">
          <div
            role="status"
            className={
              "rounded-lg border px-3 py-2 text-sm font-semibold " +
              (submitted.outcome === "met"
                ? "border-success/40 bg-success/10 text-success"
                : submitted.outcome === "partial"
                  ? "border-warning/40 bg-warning/10 text-warning"
                  : "border-destructive/40 bg-destructive/10 text-destructive")
            }
          >
            {submitted.outcome === "met"
              ? "Atendido — "
              : submitted.outcome === "partial"
                ? "Parcial — "
                : "Não atendido — "}
            {submitted.feedback.verdict}
          </div>
          {submitted.feedback.causes.map((cause, i) => (
            <p key={i} className="flex gap-2 text-sm text-muted-foreground">
              <CircleSlash2 className="mt-0.5 size-4 shrink-0 text-destructive" />
              {cause}
            </p>
          ))}
          {submitted.feedback.tradeoffs ? (
            <p className="rounded-lg border border-info/30 bg-info/5 p-3 text-sm text-foreground/90">
              Valid alternative: {submitted.feedback.tradeoffs}
            </p>
          ) : null}
          <ul className="space-y-1 text-sm">
            {task.rubric.criteria.map((c) => (
              <li key={c.key} className="flex gap-2 text-muted-foreground">
                {submitted.criteria[c.key] ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-success" />
                ) : (
                  <XCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
                )}
                <span>{c.label}</span>
              </li>
            ))}
          </ul>
          {helpLevel >= 3 ? (
            <div className="rounded-lg border border-border/60 bg-card/60 p-3 text-sm text-foreground/90">
              <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Reasoned answer
              </p>
              {task.rubric.expected}
            </div>
          ) : null}
          <p className="text-sm font-medium text-foreground">
            Next step: {submitted.feedback.nextStep}
          </p>
          <button
            type="button"
            onClick={() => {
              setSubmitted(null);
              setPicked([]);
              setOrder([]);
              setHelpLevel(0);
            }}
            className="rounded-xl border border-border bg-secondary px-3 py-2 text-xs text-foreground transition-colors hover:bg-accent"
          >
            Try again
          </button>
        </div>
      ) : null}
    </div>
  );
}

/** Grava a tentativa no store compartilhado (D7/D9). */
function useAttemptRecorder() {
  const { recordAttempt } = useLearning();
  return (task: Task, result: ReturnType<typeof evaluate>, help: number) => {
    recordAttempt({
      taskId: task.id,
      conceptId: task.conceptId,
      ts: Date.now(),
      help: Math.min(3, help) as 0 | 1 | 2 | 3,
      criteria: { ...result.criteria },
      outcome: result.outcome,
    });
  };
}

export function LessonView({ lesson, conceptId }: { lesson: Lesson; conceptId: number }) {
  const { markContact } = useLearning();
  useEffect(() => {
    markContact(conceptId);
  }, [conceptId, markContact]);

  const tasks = lesson.practiceIds
    .map((id) => getTask(id))
    .filter((t): t is Task => Boolean(t));

  return (
    <div className="mt-6 space-y-0">
      <section className="mb-8 rounded-2xl border border-primary/30 bg-primary/5 p-5">
        <p className="mb-1 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          Lesson {lesson.rev} · anchor lesson
        </p>
        <h2 className="mb-2 flex items-center gap-2 font-serif text-xl font-bold text-foreground">
          <BookOpen className="size-5 text-primary" /> Objective
        </h2>
        <p className="text-sm leading-relaxed text-foreground/90">{lesson.objective}</p>
        {lesson.prereqIds.length ? (
          <p className="mt-3 text-xs text-muted-foreground">
            Builds on prerequisite lessons: {lesson.prereqIds.join(", ")}.
          </p>
        ) : null}
      </section>

      <Section icon={Brain} title="Mental model">
        <p className="mb-3 text-sm leading-relaxed text-foreground/90">
          {lesson.mentalModel.definition}
        </p>
        <p className="mb-1 text-sm leading-relaxed text-foreground/90">
          <span className="font-semibold text-primary">Analogy: </span>
          {lesson.mentalModel.analogy}
        </p>
        <p className="mb-3 text-sm leading-relaxed text-muted-foreground">
          <span className="font-semibold">Where it breaks: </span>
          {lesson.mentalModel.analogyLimits}
        </p>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
              <th className="py-1.5 pr-2 font-semibold">In the model</th>
              <th className="py-1.5 font-semibold">In the system</th>
            </tr>
          </thead>
          <tbody>
            {lesson.mentalModel.correspondence.map(([a, b], i) => (
              <tr key={i} className="border-b border-border/30">
                <td className="py-1.5 pr-2 text-foreground/90">{a}</td>
                <td className="py-1.5 text-muted-foreground">{b}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Section>

      <Section icon={ScrollText} title="Scenario">
        <dl className="space-y-2 text-sm">
          <div>
            <dt className="font-semibold text-foreground">System</dt>
            <dd className="text-muted-foreground">{lesson.scenario.system}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Data</dt>
            <dd className="text-muted-foreground">{lesson.scenario.data}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Symptom</dt>
            <dd className="text-muted-foreground">{lesson.scenario.symptom}</dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Constraints</dt>
            <dd className="text-muted-foreground">
              <ul className="list-inside list-disc">
                {lesson.scenario.constraints.map((c, i) => (
                  <li key={i}>{c}</li>
                ))}
              </ul>
            </dd>
          </div>
          <div>
            <dt className="font-semibold text-foreground">Baseline</dt>
            <dd className="text-muted-foreground">{lesson.scenario.baseline}</dd>
          </div>
        </dl>
      </Section>

      <RepresentationBlock lesson={lesson} />

      <Section icon={ListChecks} title="Practice — decide and check">
        {tasks.length ? (
          tasks.map((t) => <PracticeTask key={t.id} task={t} />)
        ) : (
          <p className="text-sm text-muted-foreground">
            No practice tasks are authorized for this lesson yet.
          </p>
        )}
      </Section>

      <Section icon={ListChecks} title="Worked decision">
        <p className="mb-3 text-sm font-semibold text-foreground">{lesson.worked.decision}</p>
        <ol className="space-y-1.5 text-sm text-muted-foreground">
          {lesson.worked.reasoning.map((r, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-mono text-primary">{i + 1}.</span>
              <span>{r}</span>
            </li>
          ))}
        </ol>
      </Section>

      <Section icon={Repeat} title="Contrast — when not to use it">
        <div className="space-y-3">
          {lesson.contrast.map((c, i) => (
            <div key={i} className="rounded-lg border border-border/60 bg-background/50 p-3 text-sm">
              <p className="font-semibold text-foreground">{c.alternative}</p>
              <p className="text-muted-foreground">Trade-off: {c.tradeoff}</p>
              <p className="text-muted-foreground">Not for: {c.whenNotToUse}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={HelpCircle} title="Misconceptions">
        <div className="space-y-3">
          {lesson.misconceptions.map((m, i) => (
            <div key={i} className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm">
              <p className="font-semibold text-foreground">“{m.wrong}”</p>
              <p className="text-muted-foreground">Discriminant: {m.discriminant}</p>
              <p className="text-muted-foreground">Counterexample: {m.counterexample}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section icon={ArrowRight} title="Transfer">
        <p className="text-sm leading-relaxed text-foreground/90">{lesson.transfer.variant}</p>
        <p className="mt-1 text-xs text-muted-foreground">Domain: {lesson.transfer.domain}</p>
      </Section>

      <Section icon={CheckCircle2} title="Evidence — you understood if">
        <ul className="space-y-2 text-sm text-muted-foreground">
          {lesson.evidenceCriteria.map((e, i) => (
            <li key={i} className="flex gap-2">
              <span className="font-mono text-primary">□</span>
              <span>{e}</span>
            </li>
          ))}
        </ul>
      </Section>

      <p className="mb-8 text-xs leading-relaxed text-muted-foreground">
        Editorial status: {lesson.provenance.reviewed ? "reviewed" : "not independently reviewed yet"}.{" "}
        {lesson.provenance.notes}
      </p>
    </div>
  );
}
