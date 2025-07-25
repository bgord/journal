import * as UI from "@bgord/ui";
import { CheckCircle, WarningCircle } from "iconoir-react";
import React from "react";
import { Form, Link } from "react-router";
import type { AuthTypes } from "../../../app/services/auth-form";
import * as Auth from "../../auth";
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
    <main data-display="flex" data-direction="column" data-gap="24" data-mt="72">
      <Form
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
        onSubmit={signUp}
        style={{ ...UI.Rhythm(400).times(1).width, ...UI.Colorful("surface-card").background }}
      >
        <legend data-fs="24" data-transform="center">
          {t("app.register")}
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
            disabled={state === RegisterState.success}
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
            disabled={state === RegisterState.success}
            {...password.input.props}
            {...UI.Form.inputPattern(loaderData.password)}
          />
        </div>

        <button
          className="c-button"
          data-variant="primary"
          data-mt="24"
          type="submit"
          disabled={UI.Fields.allUnchanged([email, password]) || state === RegisterState.success}
        >
          {state === RegisterState.loading ? t("auth.register.in_progress") : t("auth.register.cta")}
        </button>

        {state === RegisterState.success && (
          <div
            data-display="flex"
            data-main="baseline"
            data-gap="12"
            data-mt="24"
            data-mx="auto"
            data-bg="green-100"
            data-color="green-600"
            data-py="12"
            data-px="24"
          >
            <CheckCircle height={20} width={20} />
            {t("auth.register.success")}
            <br />
            <span>
              {t("auth.register.success")}{" "}
              <Link data-transform="center" to="/">
                {t("auth.login.label")}
              </Link>
            </span>
          </div>
        )}

        {state === RegisterState.error && (
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
            {t("auth.register.error")}
          </div>
        )}

        <p data-transform="center" data-mt="12">
          {t("auth.register.have_an_account.cta")}{" "}
          <Link to="/" data-decoration="underline">
            {t("auth.login.label")}
          </Link>
        </p>
      </Form>
    </main>
  );
}
