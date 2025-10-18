import { Link, useRouter } from "@tanstack/react-router";

export function Header() {
  const router = useRouter();
  const user = router.options.context.user;

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
