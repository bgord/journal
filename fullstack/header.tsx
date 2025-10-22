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

            <form action="/api/auth/sign-out" method="post">
              <button className="c-link" type="submit">
                Logout
              </button>
            </form>
          </>
        )}

        {!user && <a href="/login">Sign in</a>}
      </nav>
    </header>
  );
}
