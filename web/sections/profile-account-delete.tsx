import { Autocomplete, Dialog, Rhythm, useMutation, useToggle, useTranslations } from "@bgord/ui";
import { UserXmark, WarningCircle } from "iconoir-react";
import { ButtonCancel, ButtonClose } from "../components";

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
    <section
      data-bc="danger-600"
      data-bs="solid"
      data-bw="hairline"
      data-gap="5"
      data-p="5"
      data-stack="y"
      dta-md-p="3"
    >
      <div data-gap="3" data-main="between" data-stack="x">
        <div data-cross="center" data-gap="3" data-stack="x">
          <UserXmark data-size="md" />
          {t("profile.delete_account.header")}
        </div>

        <div data-color="danger-400" data-cross="center" data-fs="xs" data-gap="1" data-stack="x">
          <WarningCircle data-size="sm" />
          {t("profile.delete_account.info")}
        </div>
      </div>

      <button
        className="c-button"
        data-bg="danger-900"
        data-color="danger-400"
        data-mr="auto"
        data-variant="secondary"
        onClick={dialog.enable}
        type="button"
        {...dialog.props.controller}
      >
        {t("profile.delete_account.cta_primary")}
      </button>

      <Dialog data-gap="8" data-mt="12" {...Rhythm().times(50).style.width} {...dialog}>
        <div data-main="between" data-stack="x">
          <strong data-color="neutral-300" data-cross="center" data-gap="2" data-stack="x">
            <UserXmark data-color="neutral-300" data-size="md" />
            {t("profile.delete_account.header")}
          </strong>
          <ButtonClose disabled={mutation.isLoading} onClick={dialog.disable} />
        </div>

        <div data-color="danger-400" data-cross="center" data-fs="sm" data-gap="1" data-stack="x">
          <WarningCircle data-size="sm" />
          {t("profile.delete_account.info")}
        </div>

        <form aria-busy={mutation.isLoading} data-gap="8" data-stack="y" onSubmit={mutation.handleSubmit}>
          <div data-cross="start" data-gap="3" data-stack="y">
            <label data-color="neutral-200" data-fs="sm" htmlFor="challenge">
              {t("profile.delete_account.challenge")}
            </label>
            <input
              className="c-input"
              id="challenge"
              name="challenge"
              pattern="delete"
              placeholder={t("profile.delete_account.input.placeholder")}
              required
              title={t("profile.delete_account.challenge")}
              type="text"
              {...Autocomplete.off}
            />
          </div>

          {mutation.isError && (
            <output
              aria-live="assertive"
              data-bg="neutral-700"
              data-cross="center"
              data-fs="sm"
              data-gap="3"
              data-mt="3"
              data-p="3"
              data-stack="x"
            >
              <WarningCircle data-size="md" />
              {t("profile.delete_account.error")}
            </output>
          )}

          <div data-gap="5" data-main="end" data-stack="x">
            <ButtonCancel onClick={dialog.disable} />

            <button className="c-button" data-variant="primary" disabled={mutation.isLoading} type="submit">
              {t("profile.delete_account.cta_primary")}
            </button>
          </div>
        </form>
      </Dialog>
    </section>
  );
}
