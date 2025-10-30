import { useTranslations } from "@bgord/ui";
import { CheckCircle, WarningCircle } from "iconoir-react";
import React from "react";
import { rootRoute } from "../router";
import { RequestState } from "../ui";

export function ProfilePasswordChange() {
  const t = useTranslations();

  const { session } = rootRoute.useLoaderData();
  const [state, setState] = React.useState<RequestState>(RequestState.idle);

  async function passwordChange(event: React.FormEvent) {
    event.preventDefault();

    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    const response = await fetch("/api/auth/request-password-reset", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: session.user.email, redirectTo: "/reset-password" }),
    });

    if (!response.ok) return setState(RequestState.error);

    setState(RequestState.done);
    setTimeout(() => setState(RequestState.idle), 5000);
  }

  return (
    <section data-stack="y" data-gap="5">
      <div>{t("auth.change_password.header")}</div>

      <div data-color="neutral-400" data-fs="sm">
        {t("auth.change_password.desc")}
      </div>

      <form data-stack="x" data-gap="3" onSubmit={passwordChange} aria-busy={state === RequestState.loading}>
        <button
          className="c-button"
          data-variant="secondary"
          type="submit"
          disabled={[RequestState.loading, RequestState.done].includes(state)}
        >
          {state === RequestState.loading
            ? t("auth.change_password.sending")
            : t("auth.change_password.send_cta")}
        </button>

        {state === RequestState.done && (
          <output
            aria-live="polite"
            data-stack="x"
            data-cross="center"
            data-gap="2"
            data-color="positive-400"
            data-fs="sm"
          >
            <CheckCircle data-size="sm" />
            {t("auth.change_password.sent")}
          </output>
        )}

        {state === RequestState.error && (
          <output
            aria-live="assertive"
            data-stack="x"
            data-cross="center"
            data-gap="2"
            data-color="danger-400"
            data-fs="sm"
          >
            <WarningCircle data-size="sm" />
            {t("auth.change_password.error")}
          </output>
        )}
      </form>
    </section>
  );
}
