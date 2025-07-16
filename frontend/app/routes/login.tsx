import * as UI from "@bgord/ui";
import { WarningCircle } from "iconoir-react";
import React from "react";
import * as RR from "react-router";
import type { types } from "../../../app/services/auth-form";
import { AuthForm } from "../../../app/services/auth-form";
import { authClient } from "../../auth";
import type { Route } from "./+types/login";

enum LoginState {
  idle = "idle",
  loading = "loading",
  error = "error",
}

export async function loader({ request }: Route.LoaderArgs) {
  const cookie = request.headers.get("cookie") ?? "";

  const result = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/get-session`, {
    headers: { cookie },
  });

  if (result.ok) {
    const json = await result.json();

    if (json) throw RR.redirect("/");
  }

  return AuthForm.get();
}

// TODO: translations
export default function Login({ loaderData }: Route.ComponentProps) {
  const navigate = RR.useNavigate();
  const [state, setState] = React.useState<LoginState>(LoginState.idle);

  const email = UI.useField({ name: "email", defaultValue: "admin@example.com" });
  const password = UI.useField<types.PasswordType>({ name: "password", defaultValue: "1234567890" });

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setState(LoginState.loading);

    await authClient.signIn.email(
      { email: email.value, password: password.value },
      {
        onSuccess: () => navigate("/", { replace: true }),
        onError: () => setState(LoginState.error),
      },
    );
  };

  return (
    <main data-display="flex" data-direction="column" data-gap="24">
      <RR.Form
        data-display="flex"
        data-direction="column"
        data-gap="12"
        data-mx="auto"
        data-p="48"
        data-pt="24"
        data-bc="gray-200"
        data-bw="1"
        data-br="4"
        data-shadow="sm"
        onSubmit={signIn}
        style={{ ...UI.Rhythm(400).times(1).width, ...UI.Colorful("surface-card").background }}
      >
        <legend data-fs="24" data-transform="center">
          Login
        </legend>

        <div data-display="flex" data-direction="column">
          <label className="c-label" {...email.label.props}>
            Email
          </label>

          <input
            className="c-input"
            type="email"
            placeholder="admin@example.com"
            disabled={state === LoginState.loading}
            {...email.input.props}
          />
        </div>

        <div data-display="flex" data-direction="column">
          <label className="c-label" {...password.label.props}>
            Password
          </label>

          <input
            className="c-input"
            type="password"
            placeholder="**********"
            disabled={state === LoginState.loading}
            {...password.input.props}
            {...UI.Form.inputPattern(loaderData.password)}
          />
        </div>

        <button
          className="c-button"
          data-variant="primary"
          data-mt="24"
          type="submit"
          disabled={UI.Fields.allEmpty([email, password]) || state === LoginState.loading}
        >
          {state === LoginState.loading ? "Signing in…" : "Login"}
        </button>

        {state === LoginState.error && (
          <div
            data-display="flex"
            data-gap="12"
            data-mt="24"
            data-mx="auto"
            data-bg="red-100"
            data-color="red-600"
            data-p="12"
          >
            <WarningCircle height={20} width={20} />
            Invalid credentials
          </div>
        )}

        <p data-transform="center" data-mt="12">
          Don’t have an account?{" "}
          <RR.Link to="/register" data-decoration="underline">
            Register
          </RR.Link>
        </p>
      </RR.Form>
    </main>
  );
}
