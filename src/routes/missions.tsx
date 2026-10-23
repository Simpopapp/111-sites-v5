import { createFileRoute, Outlet } from "@tanstack/react-router";

/**
 * Layout de /missions: apenas repassa para o filho ativo — o índice
 * (missions.index.tsx) ou a missão (missions.$slug.tsx). Sem o Outlet,
 * o índice pintaria por cima da missão no URL de detalhe.
 */
export const Route = createFileRoute("/missions")({
  component: () => <Outlet />,
});
