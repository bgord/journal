import type { RouteObject } from "react-router";
import { Header } from "./header";
import { Home } from "./home";
import Login, * as login from "./login";
import Protected, * as protectedRoute from "./protected";
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
      { path: "/login", element: <Login />, loader: login.loader, action: login.action },
      {
        element: <Protected />,
        loader: protectedRoute.loader,
        children: [{ path: "/", element: <Home /> }],
      },

      {
        path: "/logout",
        lazy: () => import("./logout").then((module) => ({ action: module.action, Component: () => null })),
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
