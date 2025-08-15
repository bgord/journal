import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import * as RR from "react-router";
import { AuthForm } from "../../../app/services/auth-form";
import * as Auth from "../../auth";
import * as Components from "../../components";
import type { Route } from "./+types/reset-password";

enum ResetState {
  idle = "idle",
  loading = "loading",
  done = "done",
  error = "error",
}

export async function loader(_args: Route.LoaderArgs) {
  return AuthForm.get();
}

export default function ResetPassword({ loaderData }: Route.ComponentProps) {
  const t = UI.useTranslations();
  const navigate = RR.useNavigate();

  const [state, setState] = React.useState<ResetState>(ResetState.idle);
  const [error, setError] = React.useState();

  const [params] = RR.useSearchParams();
  const token = params.get("token") ?? "";
  const tokenError = params.get("error") ?? "";

  const newPassword = UI.useField({ name: "newPassword", defaultValue: "" });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState(ResetState.loading);

    await Auth.client.resetPassword(
      { newPassword: newPassword.value, token },
      {
        onSuccess: () => {
          setState(ResetState.done);
          navigate("/", { replace: true });
        },
        onError: (context) => {
          setState(ResetState.error);
          setError(context.error.code);
        },
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
        onSubmit={onSubmit}
        style={UI.Rhythm(400).times(1).width}
      >
        <legend data-fs="xl" data-color="neutral-200" data-mb="5">
          {t("auth.reset.header")}
        </legend>

        <div data-stack="y">
          <label className="c-label" {...newPassword.label.props}>
            {t("auth.password.label")}
          </label>

          <input
            className="c-input"
            type="password"
            placeholder={t("auth.password.placeholder")}
            disabled={state === ResetState.loading}
            {...UI.Credentials.password.new}
            {...newPassword.input.props}
            {...UI.Form.inputPattern(loaderData.password)}
          />
        </div>

        <button
          className="c-button"
          data-variant="primary"
          type="submit"
          disabled={state === ResetState.loading}
        >
          {state === ResetState.loading ? t("auth.reset.in_progress") : t("auth.reset.cta")}
        </button>

        {(state === ResetState.error || tokenError) && (
          <div
            data-stack="x"
            data-cross="center"
            data-gap="3"
            data-mt="3"
            data-bg="neutral-700"
            data-color="neutral-200"
            data-p="3"
          >
            <Icons.WarningCircle data-size="md" />
            {t("auth.reset.error.generic")}

            {error === "PASSWORD_COMPROMISED" && (
              <div data-color="neutral-400" data-fs="sm">
                {t("auth.register.error.PASSWORD_COMPROMISED")}
              </div>
            )}
          </div>
        )}
      </RR.Form>
    </main>
  );
}
