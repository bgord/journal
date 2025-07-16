import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router";
import { signUp, useSession } from "../../auth";
import type { Route } from "./+types/register";

export function meta() {
  return [
    { title: "Sign up • Journal" },
    { name: "description", content: "Create a new account for the Journal app" },
  ];
}

export default function Register(_props: Route.ComponentProps) {
  const navigate = useNavigate();

  const { data: session } = useSession(); // already logged-in? send home
  const [form, setForm] = useState({
    email: "example@test.com",
    password: "123456789",
    confirm: "123456789",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /* redirect logged-in users */
  useEffect(() => {
    if (session?.user) navigate("/", { replace: true });
  }, [session, navigate]);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  /* handle submit */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!(form.email && form.password)) {
      setError("Email and password are required");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      const { error: signUpError } = await signUp.email({
        email: form.email,
        name: form.email,
        password: form.password,
      });

      if (signUpError) {
        setError(signUpError.message ?? "Could not create account");
        return;
      }

      // success → take user to login (or a “check your email” screen)
      navigate("/login", { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ---- UI ---- */
  return (
    <main className="flex flex-col items-center justify-center py-12">
      <h1 className="mb-6 text-3xl font-bold">Create an account</h1>

      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-lg border p-6 shadow">
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Email</span>
          <input
            required
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update("email")}
            className="w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Password</span>
          <input
            required
            minLength={8}
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
            className="w-full rounded border px-3 py-2"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Confirm password</span>
          <input
            required
            minLength={8}
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={update("confirm")}
            className="w-full rounded border px-3 py-2"
          />
        </label>

        {error && <p className="rounded bg-red-100 px-3 py-2 text-sm text-red-700">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
        >
          {submitting ? "Creating…" : "Sign up"}
        </button>

        <p className="text-center text-sm text-gray-600">
          Already have an account?{" "}
          <Link to="/login" className="text-indigo-700 hover:underline">
            Log in
          </Link>
        </p>
      </form>
    </main>
  );
}
