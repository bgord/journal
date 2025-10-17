import { Link, type RouteObject } from "react-router";
import { Home } from "./home";
import Login, * as login from "./login";

function NotFound() {
  return (
    <main>
      <h1>404</h1>
      <Link to="/">Go home</Link>
    </main>
  );
}

export const routes: RouteObject[] = [
  { path: "/", element: <Home /> },
  { path: "/login", loader: login.loader, action: login.action, element: <Login /> },
  { path: "*", element: <NotFound /> },
];
