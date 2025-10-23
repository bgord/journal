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
import { getSession } from "./auth.server";
import { Header } from "./header";

export type RouterContext = { request: Request | null };

type UserType = { email: string };

async function loadUser(request: Request | null): Promise<UserType | null> {
  if (request) {
    const { json } = await getSession(request);

    return json?.user ?? null;
  }

  const response = await fetch("/api/auth/get-session", { credentials: "include" }).catch(() => null);

  if (!response?.ok) return null;

  const json = await response.json();

  return json?.user ?? null;
}

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
  loader: async ({ context }) => ({ user: await loadUser(context.request) }),
  notFoundComponent: () => (
    <main>
      <h1>404</h1>
    </main>
  ),
});

const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "protected",
  loader: async ({ context }) => {
    const user = await loadUser(context.request);

    // @ts-expect-errorg
    if (!user) throw redirect({ to: "/login" });
    return { user };
  },
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
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
