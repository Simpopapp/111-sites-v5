import { Cpu } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useLearning } from "@/hooks/use-learning";

/**
 * Header global (PRD project2 D5): nav Biblioteca · Laboratórios · Progresso
 * · Meu app. O badge mostra aplicação declarada (autodeclaração, honesta) —
 * a barra de readiness percentual saiu (D9: nenhum percentual global).
 */

const NAV = [
  { to: "/", label: "Biblioteca" },
  { to: "/sandboxes", label: "Laboratórios" },
  { to: "/progress", label: "Progresso" },
  { to: "/readiness", label: "Meu app" },
] as const;

export function SiteHeader() {
  const { learning } = useLearning();
  const declared = Object.values(learning.application).filter((r) => !r.nA).length;

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link to="/" search={{}} className="flex items-center gap-2.5" aria-label="VibeCoder Academy — home">
          <div className="flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
            <Cpu className="size-4" />
          </div>
          <div className="leading-tight">
            <span className="block text-xs font-bold uppercase tracking-widest text-primary">
              VibeCoder Academy
            </span>
            <span className="block text-sm font-bold tracking-tight text-foreground">
              Applied learning
            </span>
          </div>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={{}}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-primary/10 text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          to="/readiness"
          search={{}}
          className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-semibold text-foreground transition-colors hover:border-primary/40"
          title="Declared application in your app — self-declaration, kept apart from learning evidence"
        >
          <span className="hidden text-muted-foreground sm:inline">Declared in my app:</span>
          <span className="font-mono font-bold text-primary">{declared}/111</span>
        </Link>
      </div>
      {/* Mobile: a navegação não some — barra rolável abaixo da marca (D13). */}
      <nav
        aria-label="Main navigation (mobile)"
        className="border-t border-border/40 md:hidden"
      >
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto px-4 py-1.5 sm:px-6">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={{}}
              className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              activeProps={{ className: "bg-primary/10 text-primary" }}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
