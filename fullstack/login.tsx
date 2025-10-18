import { useNavigate, useSearch } from "@tanstack/react-router";
import * as React from "react";

enum FormStatus {
  initial = "initial",
  pending = "pending",
  error = "error",
}

export function Login() {
  const search = useSearch({ from: "/login" });
  const navigate = useNavigate();

  const [status, setStatus] = React.useState<FormStatus>(FormStatus.initial);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus(FormStatus.pending);

    try {
      const response = await fetch("/api/auth/sign-in/email", {
        method: "POST",
        body: new FormData(event.currentTarget),
        credentials: "include",
      });

      if (!response.ok) return setStatus(FormStatus.error);
      navigate({ to: search.from });
    } catch {
      setStatus(FormStatus.error);
    }
  }

  return (
    <main>
      <h1>Sign in</h1>

      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            defaultValue="admin@example.com"
            required
            autoComplete="email"
            autoFocus
            disabled={status === FormStatus.pending}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            defaultValue="1234567890"
            required
            autoComplete="current-password"
            disabled={status === FormStatus.pending}
          />
        </div>

        <button type="submit" disabled={status === FormStatus.pending}>
          {status === FormStatus.pending ? "Signing in…" : "Sign in"}
        </button>

        {status === FormStatus.error ? <p role="alert">Error</p> : null}
      </form>
    </main>
  );
}
