import { Header } from "./header";
import { Home } from "./home";
import Login, * as login from "./login";
import * as logout from "./logout";
import Protected, * as protectedRoute from "./protected";
import Root, * as root from "./root";

export const routes = [
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
      { path: "/login", loader: login.loader, action: login.action, element: <Login /> },
      { path: "/logout", action: logout.action, element: null },
      {
        loader: protectedRoute.loader,
        element: <Protected />,
        children: [{ path: "/", element: <Home /> }],
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
