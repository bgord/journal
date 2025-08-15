import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import * as RR from "react-router";
import * as Auth from "../auth";
import { CancelButton } from "./cancel-button";

enum DeleteAccountState {
  idle = "idle",
  loading = "loading",
  done = "done",
  error = "error",
}

export function DeleteAccount() {
  const fetcher = RR.useFetcher();
  const t = UI.useTranslations();
  const navigate = RR.useNavigate();

  const [state, setState] = React.useState<DeleteAccountState>(DeleteAccountState.idle);
  const dialog = UI.useToggle({ name: "delete-account" });
  const challenge = UI.useField({ name: "challenge" });

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setState(DeleteAccountState.loading);

    await Auth.client.deleteUser(
      {},
      {
        onSuccess: () => {
          setState(DeleteAccountState.done);
          navigate("/", { replace: true });
        },
        onError: () => setState(DeleteAccountState.error),
      },
    );
  };

  return (
    <section data-stack="y" data-gap="5" data-bc="danger-600" data-bw="thin" data-p="5">
      <div data-stack="x" data-cross="center" data-gap="3">
        <Icons.UserXmark data-size="md" />
        <div>{t("profile.delete_account.header")}</div>
        <div
          data-stack="x"
          data-cross="center"
          data-gap="1"
          data-ml="auto"
          data-color="danger-400"
          data-fs="xs"
        >
          <Icons.WarningCircle data-size="sm" />
          {t("profile.delete_account.info")}
        </div>
      </div>

      <button
        type="button"
        className="c-button"
        data-variant="secondary"
        data-mr="auto"
        onClick={dialog.enable}
        data-color="danger-400"
        data-bg="danger-900"
      >
        {t("profile.delete_account.cta_primary")}
      </button>

      <UI.Dialog data-mt="12" {...UI.Rhythm().times(50).style.width} {...dialog}>
        <fetcher.Form data-stack="y" data-gap="8" method="POST" onSubmit={onSubmit}>
          <div data-stack="x" data-main="between" data-cross="center">
            <strong data-stack="x" data-cross="center" data-gap="2" data-fs="base" data-color="neutral-300">
              <Icons.UserXmark data-size="md" data-color="neutral-300" />
              {t("profile.delete_account.header")}
            </strong>

            <button
              className="c-button"
              data-variant="with-icon"
              type="submit"
              data-interaction="subtle-scale"
              onClick={dialog.disable}
            >
              <Icons.Xmark data-size="md" />
            </button>
          </div>

          <div data-stack="x" data-cross="center" data-gap="1" data-color="danger-400" data-fs="sm">
            <Icons.WarningCircle data-size="sm" />
            {t("profile.delete_account.info")}
          </div>

          <div data-stack="y" data-gap="3" data-cross="start">
            <legend data-color="neutral-200" data-fs="sm">
              {t("profile.delete_account.challenge")}
            </legend>
            <input className="c-input" type="text" required {...challenge.input.props} />
          </div>

          {state === DeleteAccountState.error && (
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
              <Icons.WarningCircle data-size="md" />
              {t("profile.delete_account.error")}
            </div>
          )}

          <div data-stack="x" data-main="end" data-gap="5">
            <CancelButton onClick={dialog.disable} />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={challenge.value !== "delete"}
            >
              {t("profile.delete_account.cta_primary")}
            </button>
          </div>
        </fetcher.Form>
      </UI.Dialog>
    </section>
  );
}
