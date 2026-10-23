import { QueryClient } from "@tanstack/react-query";
import { createRouter, rootRouteId } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";

import { routeTree } from "@/routeTree.gen";

// Match routes without running loaders or rendering: loaders may need a server or
// network the test run lacks, and jsdom never loads the stylesheets React waits on.
describe("App routing", () => {
  const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });

  it("matches a page for / instead of falling back to not found", () => {
    const matches = router.matchRoutes("/");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("matches the honest progress page at /progress (PRD D5)", () => {
    const matches = router.matchRoutes("/progress");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("keeps /readiness accessible for old links (renamed in place, D5/§8)", () => {
    const matches = router.matchRoutes("/readiness");
    expect(matches.at(-1)?.routeId).not.toBe(rootRouteId);
  });

  it("preserves ?q=/?cat= search params on / (F6 gate)", () => {
    router.navigate({ to: "/", search: { q: "queue", cat: "Async" } });
    expect(router.state.location.search).toEqual({ q: "queue", cat: "Async" });
  });
});
