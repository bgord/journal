import type { RouteObject } from "react-router";
import { Home } from "./home";
import Login, * as loginRoute from "./login";
import Protected, * as protectedRoute from "./protected";
import Root, * as rootRoute from "./root";
import { Header } from "./header";

function NotFound() {
  return <h1>404</h1>;
}

export const routes: RouteObject[] = [
  {
    id: "root",
    loader: rootRoute.loader,
    element: (
      <>
        <Header />
        <Root />
      </>
    ),
    children: [
      {
        path: "/login",
        loader: loginRoute.loader,
        action: loginRoute.action,
        element: <Login />,
      },
      {
        loader: protectedRoute.loader,
        element: <Protected />,
        children: [{ path: "/", element: <Home /> }],
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
];
