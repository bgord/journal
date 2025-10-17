import * as RR from "react-router";
import { getSession, signInEmail } from "./auth.server";

function pickRedirect(url: URL, fallback = "/") {
  const from = url.searchParams.get("from");

  if (from && from.startsWith("/")) return from;
  return fallback;
}

export async function loader({ request }: RR.LoaderFunctionArgs) {
  const { json } = await getSession(request);
  const user = json?.user ?? null;

  if (user) throw RR.redirect(pickRedirect(new URL(request.url), "/"));
  return null;
}

export async function action({ request }: RR.ActionFunctionArgs) {
  const url = new URL(request.url);
  const form = await request.formData();

  const email = String(form.get("email") ?? "");
  const password = String(form.get("password") ?? "");

  if (!(email && password)) {
    return Response.json({ error: "missing_credentials" }, { status: 400 });
  }

  const response = await signInEmail(request, form);

  if (!response.ok) return Response.json({ error: "invalid_credentials" }, { status: 401 });

  const cookie = response.headers.get("set-cookie") ?? "";

  throw RR.redirect(pickRedirect(url, "/"), {
    headers: cookie ? { "set-cookie": cookie } : undefined,
  });
}

export default function Login() {
  const actionData = RR.useActionData() as { error?: string } | undefined;
  const navigation = RR.useNavigation();
  const isSubmitting = navigation.state === "submitting" || navigation.state === "loading";

  return (
    <main data-stack="y" data-p="6" data-mx="auto" style={{ maxWidth: 420 }}>
      <h1 data-mb="4">Sign in</h1>

      <RR.Form method="post" data-stack="y" data-gap="4">
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
            autoFocus
            required
            autoComplete="email"
            disabled={isSubmitting}
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
            disabled={isSubmitting}
          />
        </div>

        <button className="c-button" data-variant="primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in…" : "Sign in"}
        </button>

        {actionData?.error && (
          <p data-mt="3" role="alert">
            {actionData.error === "invalid_credentials"
              ? "Invalid email or password."
              : "Please fill in both fields."}
          </p>
        )}
      </RR.Form>
    </main>
  );
}
