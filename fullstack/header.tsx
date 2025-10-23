import { Link, useLoaderData } from "@tanstack/react-router";
import { rootRoute } from "./router";

export function Header() {
  const { session } = useLoaderData({ from: rootRoute.id });

  return (
    <header>
      <Link to="/">Journal</Link>

      <nav>
        <span>{session.user.email}</span>

        <form action="/api/auth/sign-out" method="post">
          <button className="c-link" type="submit">
            Logout
          </button>
        </form>
      </nav>
    </header>
  );
}
