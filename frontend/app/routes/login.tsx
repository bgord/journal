import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import * as RR from "react-router";
import type { AuthTypes } from "../../../app/services/auth-form";
import { AuthForm } from "../../../app/services/auth-form";
import * as Auth from "../../auth";
import * as Components from "../../components";
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
    <main data-stack="y">
      <header data-stack="x" data-main="between" data-cross="center" data-p="3">
        <Components.Logo />
        <Components.LanguageSelector />
      </header>

      <RR.Form
        data-stack="y"
        data-gap="4"
        data-mt="8"
        data-mx="auto"
        data-p="8"
        data-bg="neutral-900"
        data-br="xs"
        onSubmit={signIn}
        style={UI.Rhythm(400).times(1).width}
      >
        <legend data-fs="xl" data-color="neutral-200" data-mb="5">
          {t("app.login")}
        </legend>

        <div data-stack="y">
          <label className="c-label" {...email.label.props}>
            {t("auth.email.label")}
          </label>

          <input
            autoFocus
            className="c-input"
            type="email"
            placeholder={t("auth.email.placeholder")}
            disabled={state === LoginState.loading}
            {...UI.Credentials.email}
            {...email.input.props}
          />
        </div>

        <div data-stack="y">
          <label className="c-label" {...password.label.props}>
            {t("auth.password.label")}
          </label>

          <input
            className="c-input"
            type="password"
            placeholder={t("auth.password.placeholder")}
            disabled={state === LoginState.loading}
            {...UI.Credentials.password.current}
            {...password.input.props}
            {...UI.Form.inputPattern(loaderData.password)}
          />
        </div>

        <button
          className="c-button"
          data-variant="primary"
          type="submit"
          disabled={UI.Fields.allEmpty([email, password]) || state === LoginState.loading}
        >
          {state === LoginState.loading ? t("auth.login.in_progress") : t("auth.login.cta")}
        </button>

        {state === LoginState.error && (
          <div
            data-stack="x"
            data-gap="3"
            data-mt="3"
            data-bg="neutral-700"
            data-color="neutral-200"
            data-p="3"
          >
            <Icons.WarningCircle data-size="md" />
            {t("auth.login.error.invalid_credentials")}
          </div>
        )}

        <p data-transform="center" data-color="neutral-400" data-mt="5" data-fs="sm">
          {t("auth.login.no_account.cta")}{" "}
          <RR.Link className="c-link" to="/register" data-decoration="underline">
            {t("auth.register.label")}
          </RR.Link>
        </p>

        <RR.Link className="c-link" to="/forgot-password" data-decoration="underline" data-mx="auto">
          {t("auth.forgot_password.label")}
        </RR.Link>
      </RR.Form>
    </main>
  );
}
