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
import { getSession, signOut } from "./auth.server";
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
  loader: async ({ context, location }) => {
    const user = await loadUser(context.request);

    if (!user) throw redirect({ to: "/login", search: { from: location.href }, replace: true });
    return { user };
  },
  component: () => <Outlet />,
});

const homeRoute = createRoute({
  getParentRoute: () => protectedRoute,
  path: "/",
  component: lazyRouteComponent(() => import("./home"), "Home"),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/login",
  validateSearch: function parseLoginSearch(s: Record<string, unknown>) {
    return { from: typeof s.from === "string" && s.from.startsWith("/") ? s.from : "/" };
  },
  loader: async ({ context }) => {
    const user = await loadUser(context.request);

    if (user) throw redirect({ to: "/", replace: true });
    return null;
  },
  component: lazyRouteComponent(() => import("./login"), "Login"),
});

const logoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/logout",
  preload: false,
  loader: async ({ context }) => {
    if (context.request) await signOut(context.request);
    else await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" }).catch(() => {});

    throw redirect({ to: "/login", search: { from: "/" }, replace: true });
  },
});

const routeTree = rootRoute.addChildren([loginRoute, protectedRoute.addChildren([homeRoute]), logoutRoute]);

export function createRouter(context: RouterContext) {
  return new Router({ routeTree, context, defaultPreload: "intent" });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
