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
import * as Auth from "./auth";
import * as I18n from "./i18n";
import { Navigation } from "./navigation";

export type RouterContext = { request: Request | null };

export const rootRoute = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Journal" },
    ],
    links: [
      { rel: "preload", as: "style", href: "/public/main.min.css" },
      { rel: "stylesheet", href: "/public/main.min.css" },
      { rel: "preload", as: "style", href: "/public/custom.css" },
      { rel: "stylesheet", href: "/public/custom.css" },

      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
      },
    ],
    scripts: [{ type: "module", src: "/public/entry-client.js" }],
  }),
  component: () => (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body data-mx="auto" data-bg="neutral-950">
        <div id="root">
          <Navigation />
          <Outlet />
        </div>
        <Scripts />
      </body>
    </html>
  ),
  loader: async ({ context }) => {
    const session = await Auth.getSession(context.request);
    const i18n = await I18n.getI18n(context.request);

    // @ts-expect-error
    if (!(session && translations)) throw redirect({ to: "/login" });

    return { session, i18n };
  },
  notFoundComponent: () => (
    <main>
      <h1>404</h1>
    </main>
  ),
});

const homeRoute = createRoute({
  path: "/",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/home"), "Home"),
});

const profileRoute = createRoute({
  path: "/profile",
  getParentRoute: () => rootRoute,
  component: lazyRouteComponent(() => import("./pages/profile"), "Profile"),
});

const routeTree = rootRoute.addChildren([homeRoute, profileRoute]);

export function createRouter(context: RouterContext) {
  return new Router({ routeTree, context, defaultPreload: "intent" });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
