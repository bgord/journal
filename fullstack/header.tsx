import { Link, useRouter } from "@tanstack/react-router";
import type * as React from "react";

export function Header() {
  const router = useRouter();
  const user = router.options.context.user;

  async function handleSignOut(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    await fetch("/api/auth/sign-out", { method: "POST", credentials: "include" }).catch(() => {});

    location.replace("/login");
  }

  return (
    <header>
      <Link to="/">Journal</Link>
      <nav>
        {!user ? (
          <Link to="/login" search={{ from: "/" }}>
            Sign in
          </Link>
        ) : (
          <>
            <span>{user.email}</span>
            <button type="button" onClick={handleSignOut}>
              Sign out
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
