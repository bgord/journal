import * as UI from "@bgord/ui";
import { WarningCircle } from "iconoir-react";
import React from "react";
import * as RR from "react-router";
import type { AuthTypes } from "../../../app/services/auth-form";
import { AuthForm } from "../../../app/services/auth-form";
import * as Auth from "../../auth";
import type { Route } from "./+types/login";

enum LoginState {
  idle = "idle",
  loading = "loading",
  error = "error",
}

export async function loader({ request }: Route.LoaderArgs) {
  await Auth.guard.requireNoSession(request);

  return AuthForm.get();
}

export default function Login({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();
  const navigate = RR.useNavigate();
  const [state, setState] = React.useState<LoginState>(LoginState.idle);

  const email = UI.useField({ name: "email", defaultValue: "admin@example.com" });
  const password = UI.useField<AuthTypes.PasswordType>({ name: "password", defaultValue: "1234567890" });

  const signIn = async (event: React.FormEvent) => {
    event.preventDefault();
    setState(LoginState.loading);

    await Auth.client.signIn.email(
      { email: email.value, password: password.value },
      {
        onSuccess: () => navigate("/home", { replace: true }),
        onError: () => setState(LoginState.error),
      },
    );
  };

  return (
    <main data-display="flex" data-direction="column" data-gap="24" data-mt="72">
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
          {t("app.login")}
        </legend>

        <div data-display="flex" data-direction="column">
          <label className="c-label" {...email.label.props}>
            {t("auth.email.label")}
          </label>

          <input
            autoFocus
            className="c-input"
            type="email"
            placeholder={t("auth.email.placeholder")}
            disabled={state === LoginState.loading}
            {...email.input.props}
          />
        </div>

        <div data-display="flex" data-direction="column">
          <label className="c-label" {...password.label.props}>
            {t("auth.password.label")}
          </label>

          <input
            className="c-input"
            type="password"
            placeholder={t("auth.password.placeholder")}
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
          {state === LoginState.loading ? t("auth.login.in_progress") : t("auth.login.cta")}
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
            {t("auth.login.error.invalid_credentials")}
          </div>
        )}

        <p data-transform="center" data-mt="12">
          {t("auth.login.no_account.cta")}{" "}
          <RR.Link to="/register" data-decoration="underline">
            {t("auth.register.label")}
          </RR.Link>
        </p>
      </RR.Form>
    </main>
  );
}
