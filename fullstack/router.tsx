import {
  createRootRouteWithContext,
  createRoute,
  HeadContent,
  lazyRouteComponent,
  Outlet,
  Router,
  redirect,
  Scripts,
} from "@tanstack/react-router";
import * as auth from "./auth";
import { Header } from "./header";

export type RouterContext = { request: Request | null };

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Journal" },
    ],
    scripts: [{ type: "module", src: "/public/entry-client.js" }],
  }),
  component: () => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <div id="root">
          <Header />
          <Outlet />
        </div>
        <Scripts />
      </body>
    </html>
  ),
  loader: async ({ context }) => {
    const session = await auth.getSession(context.request);
    console.log("rootRoute", "loader", session);

    // @ts-expect-error
    if (!session) throw redirect({ to: "/login" });
    return { session };
  },
  notFoundComponent: () => (
    <main>
      <h1>404</h1>
    </main>
  ),
});

const protectedRoute = createRoute({
  id: "protected",
  getParentRoute: () => rootRoute,
  loader: async ({ context }) => {
    const session = await auth.getSession(context.request);
    console.log("protectedRoute", "loader", session);

    // @ts-expect-error
    if (!session) throw redirect({ to: "/login" });
    return session;
  },
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  path: "/",
  getParentRoute: () => protectedRoute,
  component: lazyRouteComponent(() => import("./home"), "Home"),
});

const routeTree = rootRoute.addChildren([protectedRoute.addChildren([homeRoute])]);

export function createRouter(context: RouterContext) {
  return new Router({ routeTree, context, defaultPreload: "intent" });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
