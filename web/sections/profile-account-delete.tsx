import { Autocomplete, Dialog, Rhythm, useToggle, useTranslations } from "@bgord/ui";
import { UserXmark, WarningCircle } from "iconoir-react";
import { ButtonCancel, ButtonClose } from "../components";
import { useMutation } from "../sections/use-mutation";

export function ProfileAccountDelete() {
  const t = useTranslations();

  const dialog = useToggle({ name: "delete-account" });

  const mutation = useMutation({
    perform: () =>
      fetch("/api/auth/delete-user", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      }),
    onSuccess: () => window.location.replace("/public/login.html"),
  });

  return (
    <section data-stack="y" data-gap="5" data-p="5" data-bc="danger-600" data-bw="thin">
      <div data-stack="x" data-gap="3">
        <UserXmark data-size="md" />
        <div>{t("profile.delete_account.header")}</div>

        <div
          data-stack="x"
          data-cross="center"
          data-gap="1"
          data-ml="auto"
          data-color="danger-400"
          data-fs="xs"
        >
          <WarningCircle data-size="sm" />
          {t("profile.delete_account.info")}
        </div>
      </div>

      <button
        type="button"
        onClick={dialog.enable}
        className="c-button"
        data-variant="secondary"
        data-mr="auto"
        data-color="danger-400"
        data-bg="danger-900"
      >
        {t("profile.delete_account.cta_primary")}
      </button>

      <Dialog data-gap="8" data-mt="12" {...Rhythm().times(50).style.width} {...dialog}>
        <div data-stack="x" data-main="between">
          <strong data-stack="x" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
            <UserXmark data-size="md" data-color="neutral-300" />
            {t("profile.delete_account.header")}
          </strong>
          <ButtonClose onClick={dialog.disable} disabled={mutation.isLoading} />
        </div>

        <div data-stack="x" data-cross="center" data-gap="1" data-color="danger-400" data-fs="sm">
          <WarningCircle data-size="sm" />
          {t("profile.delete_account.info")}
        </div>

        <form data-stack="y" data-gap="8" onSubmit={mutation.handleSubmit} aria-busy={mutation.isLoading}>
          <div data-stack="y" data-gap="3" data-cross="start">
            <label data-color="neutral-200" data-fs="sm" htmlFor="challenge">
              {t("profile.delete_account.challenge")}
            </label>
            <input
              className="c-input"
              id="challenge"
              name="challenge"
              type="text"
              required
              title={t("profile.delete_account.challenge")}
              pattern="delete"
              {...Autocomplete.off}
            />
          </div>

          {mutation.isError && (
            <output
              aria-live="assertive"
              data-stack="x"
              data-cross="center"
              data-gap="3"
              data-mt="3"
              data-fs="sm"
              data-bg="neutral-700"
              data-color="neutral-200"
              data-p="3"
            >
              <WarningCircle data-size="md" />
              {t("profile.delete_account.error")}
            </output>
          )}

          <div data-stack="x" data-main="end" data-gap="5">
            <ButtonCancel onClick={dialog.disable} />

            <button type="submit" className="c-button" data-variant="primary" disabled={mutation.isLoading}>
              {t("profile.delete_account.cta_primary")}
            </button>
          </div>
        </form>
      </Dialog>
    </section>
  );
}
