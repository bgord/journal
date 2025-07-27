import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import * as RR from "react-router";
import type { AuthTypes } from "../../../app/services/auth-form";
import * as Auth from "../../auth";
import * as Components from "../../components";
import { ReadModel } from "../../read-model";
import type { Route } from "./+types/register";

enum RegisterState {
  idle = "idle",
  loading = "loading",
  success = "success",
  error = "error",
}

export async function loader({ request }: Route.LoaderArgs) {
  await Auth.guard.requireNoSession(request);

  return ReadModel.AuthForm;
}

export default function Register({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();
  const [state, setState] = React.useState<RegisterState>(RegisterState.idle);

  const email = UI.useField({ name: "email", defaultValue: "" });
  const password = UI.useField<AuthTypes.PasswordType>({ name: "password", defaultValue: "" });

  const signUp = async (event: React.FormEvent) => {
    event.preventDefault();

    await Auth.client.signUp.email(
      { email: email.value, password: password.value, name: email.value },
      {
        onSuccess: () => setState(RegisterState.success),
        onError: () => setState(RegisterState.error),
      },
    );
  };

  return (
    <main data-disp="flex" data-dir="column">
      <header data-disp="flex" data-main="between" data-cross="center" data-p="3">
        <Components.Logo />
        <Components.LanguageSelector />
      </header>

      <RR.Form
        data-disp="flex"
        data-dir="column"
        data-gap="4"
        data-mt="8"
        data-mx="auto"
        data-p="8"
        data-bg="neutral-900"
        data-br="xs"
        onSubmit={signUp}
        style={UI.Rhythm(400).times(1).width}
      >
        <legend data-fs="xl" data-color="neutral-200" data-mb="5">
          {t("app.register")}
        </legend>

        <div data-disp="flex" data-dir="column">
          <label className="c-label" {...email.label.props}>
            {t("auth.email.label")}
          </label>

          <input
            autoFocus
            className="c-input"
            type="email"
            placeholder={t("auth.email.placeholder")}
            disabled={state === RegisterState.success}
            {...email.input.props}
          />
        </div>

        <div data-disp="flex" data-dir="column">
          <label className="c-label" {...password.label.props}>
            {t("auth.password.label")}
          </label>

          <input
            className="c-input"
            type="password"
            placeholder={t("auth.password.placeholder")}
            disabled={state === RegisterState.success}
            {...password.input.props}
            {...UI.Form.inputPattern(loaderData.password)}
          />
        </div>

        <button
          className="c-button"
          data-variant="primary"
          type="submit"
          disabled={UI.Fields.allUnchanged([email, password]) || state === RegisterState.success}
        >
          {state === RegisterState.loading ? t("auth.register.in_progress") : t("auth.register.cta")}
        </button>

        {state === RegisterState.success && (
          <div
            data-disp="flex"
            data-cross="center"
            data-gap="3"
            data-mt="3"
            data-p="2"
            data-fs="base"
            data-bg="positive-300"
            data-br="xs"
          >
            <Icons.CheckCircle data-size="md" />
            {t("auth.register.success")}

            <RR.Link className="c-link" to="/">
              {t("auth.login.label")}
            </RR.Link>
          </div>
        )}

        {state === RegisterState.error && (
          <div
            data-disp="flex"
            data-gap="3"
            data-mt="3"
            data-bg="neutral-700"
            data-color="neutral-200"
            data-p="3"
          >
            <Icons.WarningCircle data-size="md" />
            {t("auth.register.error")}
          </div>
        )}

        {state !== RegisterState.success && (
          <p data-transform="center" data-color="neutral-400" data-mt="5">
            {t("auth.register.have_an_account.cta")}{" "}
            <RR.Link className="c-link" to="/" data-decoration="underline">
              {t("auth.login.label")}
            </RR.Link>
          </p>
        )}
      </RR.Form>
    </main>
  );
}
