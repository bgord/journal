import { Link, type RouteObject } from "react-router";
import { Home } from "./home";
import { Login } from "./login";

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
  { path: "/login", element: <Login /> },
  { path: "*", element: <NotFound /> },
];
