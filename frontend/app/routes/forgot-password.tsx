import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import * as RR from "react-router";
import * as Auth from "../../auth";
import * as Components from "../../components";
import type { Route } from "./+types/forgot-password";

enum ForgotPasswordState {
  idle = "idle",
  loading = "loading",
  success = "success",
  error = "error",
}

export async function loader({ request }: Route.LoaderArgs) {
  await Auth.guard.requireNoSession(request);
}

export default function ForgotPassword() {
  const t = UI.useTranslations();
  const [state, setState] = React.useState<ForgotPasswordState>(ForgotPasswordState.idle);

  const email = UI.useField({ name: "email", defaultValue: "" });

  const forgotPassword = async (event: React.FormEvent) => {
    event.preventDefault();
    setState(ForgotPasswordState.loading);

    await Auth.client.forgetPassword(
      { email: email.value, redirectTo: `${window.location.origin}/reset-password` },
      {
        onSuccess: () => setState(ForgotPasswordState.success),
        onError: () => setState(ForgotPasswordState.error),
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
        onSubmit={forgotPassword}
        style={UI.Rhythm(400).times(1).width}
      >
        <legend data-fs="xl" data-color="neutral-200" data-mb="5">
          {t("auth.forgot_password.header")}
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
            disabled={state === ForgotPasswordState.loading}
            {...UI.Credentials.email}
            {...email.input.props}
          />
        </div>

        <button
          className="c-button"
          data-variant="primary"
          type="submit"
          disabled={email.unchanged || state === ForgotPasswordState.loading}
        >
          {state === ForgotPasswordState.loading
            ? t("auth.forgot_password.in_progress")
            : t("auth.forgot_password.cta")}
        </button>

        {state === ForgotPasswordState.error && (
          <div
            data-stack="x"
            data-cross="center"
            data-gap="3"
            data-mt="3"
            data-bg="neutral-700"
            data-color="neutral-200"
            data-p="3"
            data-fs="sm"
          >
            <Icons.WarningCircle data-size="md" />
            {t("auth.forgot_password.error")}
          </div>
        )}

        {state === ForgotPasswordState.success && (
          <div
            data-stack="x"
            data-cross="center"
            data-gap="2"
            data-mt="3"
            data-p="2"
            data-fs="base"
            data-bg="positive-200"
            data-color="positive-800"
            data-br="xs"
          >
            <Icons.CheckCircle data-size="md" />
            {t("auth.forgot_password.success")}
          </div>
        )}
      </RR.Form>
    </main>
  );
}
