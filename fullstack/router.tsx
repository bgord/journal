import {
  createRootRouteWithContext,
  createRoute,
  HeadContent,
  Outlet,
  Router,
  redirect,
  Scripts,
} from "@tanstack/react-router";
import { Home } from "./home";

export type RouterContext = { user: { email?: string } | null };

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Journal" },
    ],
    scripts: [{ type: "module", src: "/assets/entry-client.js" }],
  }),
  component: function RootDocument() {
    return (
      <html lang="en">
        <head>
          <HeadContent />
        </head>
        <body>
          <div id="root">
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
    </main>
  ),
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  beforeLoad: ({ context, location }) => {
    if (!context.user) {
      throw redirect({ to: "/login", search: { from: location.href }, replace: true });
    }
  },
  component: () => <Outlet />,
});

const homeRoute = createRoute({ getParentRoute: () => protectedRoute, path: "/", component: Home });

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  beforeLoad: ({ context, search }) => {
    if (context.user) {
      const from = typeof search?.from === "string" && search.from.startsWith("/") ? search.from : "/";
      throw redirect({ to: from, replace: true });
    }
  },
  component: () => (
    <main>
      <h1 data-mb="4">Sign in</h1>
    </main>
  ),
});

const routeTree = rootRoute.addChildren([loginRoute, protectedRoute.addChildren([homeRoute])]);

export function createRouter(ctx: RouterContext) {
  return new Router({ routeTree, context: ctx });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
