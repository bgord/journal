import { useTranslations } from "@bgord/ui";
import * as Icons from "iconoir-react";
import React from "react";
import { Avatar, AvatarSize } from "../components/avatar";
import { RequestState } from "../ui";
import { useFile } from "./use-file";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export function ProfileAvatarChange() {
  const t = useTranslations();
  const avatar = useFile("avatar");
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
  }

  return (
    <section data-stack="y" data-gap="4">
      <div data-stack="x" data-cross="center" data-gap="3">
        <Icons.UserCircle data-size="md" />
        <div>{t("profile.avatar.header")}</div>
      </div>

      <div data-stack="x" data-gap="6">
        <Avatar size={AvatarSize.large} />

        <form onSubmit={changeProfileAvatar} encType="multipart/form-data" data-mt="3">
          <div data-stack="x" data-gap="3" data-cross="center">
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
                accept={ALLOWED_MIME_TYPES.join(",")}
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
              {t("profile.avatar.upload.cta")}
            </button>

            {avatar.isSelected && (
              <button
                type="button"
                className="c-button"
                data-variant="secondary"
                onClick={avatar.actions.clearFile}
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
            <output data-fs="xs" data-color="neutral-300" data-mt="2" data-animation="grow-fade-in">
              {t("profile.avatar.selected", { name: avatar.data.name })}
            </output>
          )}
        </form>
      </div>
    </section>
  );
}
