import { createRootRouteWithContext, createRoute, Outlet, Router } from "@tanstack/react-router";
import { Home } from "./home";

/**
 * Step 1: empty context. We’ll add { user } in a later step.
 * Docs: Router Context
 * https://tanstack.com/router/v1/docs/framework/react/guide/router-context
 */
export type RouterContext = Record<string, never>;

/**
 * Root route renders an <Outlet/> for children.
 * Docs: createRootRouteWithContext + Outlets
 * https://tanstack.com/router/v1/docs/framework/react/api/router/createRootRouteWithContextFunction
 * https://tanstack.com/router/v1/docs/framework/react/guide/outlets
 */
export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div data-p="4">
      <Outlet />
    </div>
  ),
  // Minimal notFound so we see something on unknown paths
  // Docs: Not Found Errors
  // https://tanstack.com/router/v1/docs/framework/react/guide/not-found-errors
  notFoundComponent: () => (
    <main>
      <h1>404</h1>
      <p>Nothing to see here (yet).</p>
    </main>
  ),
});

/**
 * Simple "/" route so we can smoke-test rendering.
 */
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});

/**
 * Compose the route tree.
 * Docs: Creating a Router / RouterOptions.routeTree
 * https://tanstack.com/router/v1/docs/framework/react/guide/creating-a-router
 */
const routeTree = rootRoute.addChildren([indexRoute]);

/**
 * Router factory. Server/client will both call this.
 */
export function createRouter(ctx: RouterContext) {
  return new Router({
    routeTree,
    context: ctx,
  });
}

/**
 * Type augmentation for full type-safety with this router.
 * Docs: Type Safety (Register.router)
 * https://tanstack.com/router/v1/docs/framework/react/guide/type-safety
 */
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
