import { Link, useLoaderData } from "@tanstack/react-router";
import { rootRoute } from "./router";

export function Header() {
  const { user } = useLoaderData({ from: rootRoute.id });

  return (
    <header>
      <Link to="/">Journal</Link>

      <nav>
        {user && (
          <>
            <span>{user.email}</span>
            <Link to="/logout">Sign out</Link>
          </>
        )}

        {!user && (
          <Link to="/login" search={{ from: "/" }}>
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
