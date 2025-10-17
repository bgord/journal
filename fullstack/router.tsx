import {
  createRootRouteWithContext,
  createRoute,
  HeadContent,
  Outlet,
  Router,
  Scripts,
} from "@tanstack/react-router";
import { Home } from "./home";

/**
 * Step 2: still empty context (we’ll add { user } later).
 * Docs: Router Context
 */
export type RouterContext = Record<string, never>;

/**
 * Root route renders the full HTML document for SSR.
 * Include <HeadContent /> and <Scripts /> so dehydration/hydration works.
 */
export const rootRoute = createRootRouteWithContext<RouterContext>()({
  component: function RootDocument() {
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <div id="root" data-p="4">
            <Outlet />
          </div>
          <Scripts />
        </body>
      </html>
    );
  },
  notFoundComponent: () => (
    <main>
      <h1>404</h1>
      <p>Nothing to see here (yet).</p>
    </main>
  ),
  scripts: () => [{ type: "module", src: "/assets/entry-client.js" }],
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
 */
declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
