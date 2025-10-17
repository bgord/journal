import {
  createRootRouteWithContext,
  createRoute,
  HeadContent,
  Outlet,
  Router,
  Scripts,
} from "@tanstack/react-router";
import { Home } from "./home";

export type RouterContext = Record<string, never>;

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

const indexRoute = createRoute({ getParentRoute: () => rootRoute, path: "/", component: Home });

const routeTree = rootRoute.addChildren([indexRoute]);

export function createRouter(context: RouterContext) {
  return new Router({ routeTree, context });
}

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof createRouter>;
  }
}
