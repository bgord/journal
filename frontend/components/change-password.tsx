import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import * as Auth from "../auth";

enum ResetPasswordState {
  idle = "idle",
  loading = "loading",
  sent = "sent",
  error = "error",
}

export function ChangePassword({ email }: { email: string }) {
  const t = UI.useTranslations();
  const [state, setState] = React.useState<ResetPasswordState>(ResetPasswordState.idle);

  const sendLink = async () => {
    setState(ResetPasswordState.loading);
    try {
      const redirectTo = `${window.location.origin}/reset-password`;
      await Auth.client.requestPasswordReset({ email, redirectTo });
      setState(ResetPasswordState.sent);
    } catch {
      setState(ResetPasswordState.error);
    }
  };

  return (
    <section data-stack="y" data-gap="5">
      <div>{t("auth.change_password.header")}</div>

      <div data-color="neutral-400" data-fs="sm">
        {t("auth.change_password.desc")}
      </div>

      <div data-stack="x" data-gap="3">
        <button
          className="c-button"
          data-variant="secondary"
          type="button"
          disabled={state === ResetPasswordState.loading || state === ResetPasswordState.sent}
          onClick={sendLink}
        >
          {state === ResetPasswordState.loading
            ? t("auth.change_password.sending")
            : t("auth.change_password.send_cta")}
        </button>

        {state === ResetPasswordState.sent && (
          <div data-stack="x" data-cross="center" data-gap="2" data-color="positive-400" data-fs="sm">
            <Icons.CheckCircle data-size="sm" />
            {t("auth.change_password.sent")}
          </div>
        )}

        {state === ResetPasswordState.error && (
          <div data-stack="x" data-cross="center" data-gap="2" data-color="danger-400" data-fs="sm">
            <Icons.WarningCircle data-size="sm" />
            {t("auth.change_password.error")}
          </div>
        )}
      </div>
    </section>
  );
}
