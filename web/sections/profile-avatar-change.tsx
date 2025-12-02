import { exec, useFile, useMutation, useTranslations } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { UserCircle } from "iconoir-react";
import { rootRoute } from "../router";
import { ProfileAvatarDelete } from "./profile-avatar-delete";

const mimeTypes = ["image/png", "image/jpeg", "image/webp"];

export function ProfileAvatarChange() {
  const router = useRouter();
  const t = useTranslations();
  const avatar = useFile("avatar", { mimeTypes, maxSizeBytes: 10_000_000 });

  const mutation = useMutation({
    perform: () => {
      const form = new FormData();
      form.append("file", avatar.data as File);

      return fetch("/api/preferences/profile-avatar/update", {
        method: "POST",
        body: form,
        credentials: "include",
      });
    },
    onSuccess: () => {
      router.invalidate({ filter: (r) => r.id === rootRoute.id, sync: true });
      avatar.actions.clearFile();
    },
  });

  return (
    <section data-stack="y" data-gap="4">
      <div data-stack="x" data-cross="center" data-gap="3">
        <UserCircle data-size="md" />
        <div>{t("profile.avatar.header")}</div>
      </div>

      <div data-stack="x" data-gap="6">
        <ProfileAvatarDelete />

        <form onSubmit={mutation.handleSubmit} encType="multipart/form-data" data-mt="3">
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
              disabled={!avatar.isSelected || mutation.isLoading}
            >
              {mutation.isLoading ? t("profile.avatar.upload.cta.loading") : t("profile.avatar.upload.cta")}
            </button>

            {avatar.isSelected && (
              <button
                type="button"
                className="c-button"
                data-variant="secondary"
                onClick={exec([avatar.actions.clearFile, mutation.reset])}
                disabled={mutation.isLoading}
                data-animation="grow-fade-in"
              >
                {t("app.clear")}
              </button>
            )}
          </div>

          <div data-fs="xs" data-color="neutral-500" data-my="2">
            {t("profile.avatar.hint")}
          </div>

          {avatar.isSelected && (
            <output data-fs="xs" data-color="neutral-300" data-animation="grow-fade-in">
              {t("profile.avatar.selected", { name: avatar.data.name })}
            </output>
          )}

          {mutation.isError && (
            <output data-mt="3" data-fs="xs" data-color="danger-400" data-animation="grow-fade-in">
              {t("profile.avatar.upload.error")}
            </output>
          )}
        </form>
      </div>
    </section>
  );
}
