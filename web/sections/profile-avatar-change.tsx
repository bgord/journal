import { exec, useFile, useTranslations } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { UserCircle } from "iconoir-react";
import React from "react";
import { rootRoute } from "../router";
import { RequestState } from "../ui";
import { ProfileAvatarDelete } from "./profile-avatar-delete";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];

export function ProfileAvatarChange() {
  const router = useRouter();
  const t = useTranslations();
  const avatar = useFile("avatar", { mimeTypes, maxSizeBytes: 10_000_000 });
  const [state, setState] = React.useState<RequestState>(RequestState.idle);

  async function changeProfileAvatar(event: React.FormEvent) {
    event.preventDefault();

    if (state === RequestState.loading) return;
    if (!avatar.isSelected) return;

    const form = new FormData();
    form.append("file", avatar.data);

    const response = await fetch("/api/preferences/profile-avatar/update", {
      method: "POST",
      body: form,
      credentials: "include",
    });

    if (!response.ok) return setState(RequestState.error);
    setState(RequestState.done);
    router.invalidate({ filter: (r) => r.id === rootRoute.id, sync: true });
    avatar.actions.clearFile();
  }

  return (
    <section data-stack="y" data-gap="4">
      <div data-stack="x" data-cross="center" data-gap="3">
        <UserCircle data-size="md" />
        <div>{t("profile.avatar.header")}</div>
      </div>

      <div data-stack="x" data-gap="6">
        <ProfileAvatarDelete />

        <form onSubmit={changeProfileAvatar} encType="multipart/form-data" data-mt="3">
          <div data-stack="x" data-gap="3">
            <label
              data-disp="flex"
              data-main="center"
              data-cross="center"
              className="c-button"
              data-variant="secondary"
              {...avatar.label.props}
            >
              <span>{t("profile.avatar.select_file.cta")}</span>
              <input
                className="c-file-explorer"
                type="file"
                required
                onChange={avatar.actions.selectFile}
                disabled={avatar.isSelected}
                {...avatar.input.props}
              />
            </label>

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={!avatar.isSelected || state === RequestState.loading}
            >
              {state === RequestState.loading
                ? t("profile.avatar.upload.cta.loading")
                : t("profile.avatar.upload.cta")}
            </button>

            {avatar.isSelected && (
              <button
                type="button"
                className="c-button"
                data-variant="secondary"
                onClick={exec([avatar.actions.clearFile, () => setState(RequestState.idle)])}
                disabled={state === RequestState.loading}
                data-animation="grow-fade-in"
              >
                {t("app.clear")}
              </button>
            )}
          </div>

          <div data-fs="xs" data-color="neutral-500" data-mt="2">
            {t("profile.avatar.hint")}
          </div>

          {avatar.isSelected && (
            <output data-fs="xs" data-color="neutral-300" data-animation="grow-fade-in">
              {t("profile.avatar.selected", { name: avatar.data.name })}
            </output>
          )}

          {state === RequestState.error && (
            <output data-fs="xs" data-color="danger-400" data-animation="grow-fade-in">
              {t("profile.avatar.upload.error")}
            </output>
          )}
        </form>
      </div>
    </section>
  );
}
