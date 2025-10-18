import { useSearch, useNavigate } from "@tanstack/react-router";
import * as React from "react";

export function Login() {
  const search = useSearch({ from: "/login" });
  const navigate = useNavigate();

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        body: form,
        credentials: "include",
      });

      if (!response.ok) {
        setError(response.status === 401 ? "Invalid email or password." : "Login failed.");
        setSubmitting(false);
        return;
      }

      // Hard navigation to let SSR rebuild with context.user
      navigate({ to: search.from });
    } catch {
      setError("Network error. Try again.");
      setSubmitting(false);
    }
  }

  return (
    <main data-stack="y" data-p="6" data-mx="auto" style={{ maxWidth: 420 }}>
      <h1 data-mb="4">Sign in</h1>

      <form onSubmit={onSubmit} data-stack="y" data-gap="4">
        <div data-stack="y">
          <label className="c-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className="c-input"
            defaultValue="admin@example.com"
            required
            autoComplete="email"
            autoFocus
            disabled={submitting}
          />
        </div>

        <div data-stack="y">
          <label className="c-label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="c-input"
            defaultValue="1234567890"
            required
            autoComplete="current-password"
            disabled={submitting}
          />
        </div>

        <button className="c-button" data-variant="primary" type="submit" disabled={submitting}>
          {submitting ? "Signing in…" : "Sign in"}
        </button>

        {error ? (
          <p data-mt="3" role="alert">
            {error}
          </p>
        ) : null}
      </form>
    </main>
  );
}
