import type { RouteObject } from "react-router";
import { Header } from "./header";
import Root, * as root from "./root";

export const routes: RouteObject[] = [
  {
    id: "root",
    loader: root.loader,
    element: (
      <>
        <Header />
        <Root />
      </>
    ),
    children: [
      {
        path: "/login",
        lazy: () =>
          import("./login").then((m) => ({ Component: m.default, loader: m.loader, action: m.action })),
      },
      {
        path: "/logout",
        lazy: () => import("./logout").then((m) => ({ action: m.action, Component: () => null })),
      },
      {
        lazy: () => import("./protected").then((m) => ({ Component: m.default, loader: m.loader })),
        children: [{ path: "/", lazy: () => import("./home").then((m) => ({ Component: m.Home })) }],
      },
      {
        path: "*",
        element: (
          <main>
            <h1>404</h1>
          </main>
        ),
      },
    ],
  },
];
