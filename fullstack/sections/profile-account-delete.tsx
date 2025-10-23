import * as UI from "@bgord/ui";
import { UserXmark, WarningCircle, Xmark } from "iconoir-react";
import React from "react";
import { ButtonCancel } from "../components/button-cancel";
import { RequestState } from "../ui";

export function ProfileAccountDelete() {
  const t = UI.useTranslations();

  const dialog = UI.useToggle({ name: "delete-account" });
  const [state, setState] = React.useState<RequestState>(RequestState.idle);

  const accountDelete = async (event: React.FormEvent) => {
    event.preventDefault();

    if (state === RequestState.loading) return;

    setState(RequestState.loading);

    const response = await fetch("/api/auth/delete-user", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    if (!response.ok) return setState(RequestState.error);

    setState(RequestState.done);
    window.location.replace("/login");
  };

  return (
    <section data-stack="y" data-gap="5" data-p="5" data-bc="danger-600" data-bw="thin">
      <div data-stack="x" data-cross="center" data-gap="3">
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

      <UI.Dialog data-gap="8" data-mt="12" {...UI.Rhythm().times(50).style.width} {...dialog}>
        <div data-stack="x" data-main="between" data-cross="center">
          <strong data-stack="x" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
            <UserXmark data-size="md" data-color="neutral-300" />
            {t("profile.delete_account.header")}
          </strong>

          <button
            className="c-button"
            data-variant="with-icon"
            type="button"
            data-interaction="subtle-scale"
            onClick={dialog.disable}
          >
            <Xmark data-size="md" />
          </button>
        </div>

        <div data-stack="x" data-cross="center" data-gap="1" data-color="danger-400" data-fs="sm">
          <WarningCircle data-size="sm" />
          {t("profile.delete_account.info")}
        </div>

        <form data-stack="y" data-gap="8" onSubmit={accountDelete}>
          <div data-stack="y" data-gap="3" data-cross="start">
            <label data-color="neutral-200" data-fs="sm" htmlFor="challenge">
              {t("profile.delete_account.challenge")}
            </label>
            <input
              id="challenge"
              name="challenge"
              className="c-input"
              type="text"
              required
              pattern="delete"
            />
          </div>

          {state === RequestState.error && (
            <div
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
            </div>
          )}

          <div data-stack="x" data-main="end" data-gap="5">
            <ButtonCancel onClick={dialog.disable} />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={state === RequestState.loading}
            >
              {t("profile.delete_account.cta_primary")}
            </button>
          </div>
        </form>
      </UI.Dialog>
    </section>
  );
}
