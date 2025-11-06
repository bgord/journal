import { useMutation, useTranslations } from "@bgord/ui";
import { CheckCircle, WarningCircle } from "iconoir-react";
import { rootRoute } from "../router";

export function ProfilePasswordChange() {
  const t = useTranslations();

  const { session } = rootRoute.useLoaderData();

  const mutation = useMutation({
    perform: () =>
      fetch("/api/auth/request-password-reset", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email, redirectTo: "/reset-password" }),
      }),
    autoResetDelayMs: 5000,
  });

  return (
    <section data-stack="y" data-gap="5">
      <div>{t("auth.change_password.header")}</div>

      <div data-color="neutral-400" data-fs="sm">
        {t("auth.change_password.desc")}
      </div>

      <form data-stack="x" data-gap="3" onSubmit={mutation.handleSubmit} aria-busy={mutation.isLoading}>
        <button
          className="c-button"
          data-variant="secondary"
          type="submit"
          disabled={mutation.isLoading || mutation.isDone}
        >
          {mutation.isLoading ? t("auth.change_password.sending") : t("auth.change_password.send_cta")}
        </button>

        {mutation.isDone && (
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

        {mutation.isError && (
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
