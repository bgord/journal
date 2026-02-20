import { exec, useFile, useMutation, useTranslations } from "@bgord/ui";
import { useRouter } from "@tanstack/react-router";
import { UserCircle } from "iconoir-react";
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
      router.invalidate({ filter: () => true, sync: true });
      avatar.actions.clearFile();
    },
  });

  return (
    <section data-gap="5" data-stack="y">
      <div data-cross="center" data-gap="3" data-stack="x">
        <UserCircle data-size="md" />
        <div>{t("profile.avatar.header")}</div>
      </div>

      <div data-gap="5" data-stack="x">
        <ProfileAvatarDelete />

        <form data-gap="2" data-stack="y" encType="multipart/form-data" onSubmit={mutation.handleSubmit}>
          <div data-gap="3" data-stack="x">
            <label
              className="c-button"
              data-cross="center"
              data-disp="flex"
              data-main="center"
              data-variant="secondary"
              {...avatar.label.props}
            >
              <span>{t("profile.avatar.select_file.cta")}</span>
              <input
                className="c-visually-hidden"
                disabled={avatar.isSelected}
                onChange={avatar.actions.selectFile}
                required
                type="file"
                {...avatar.input.props}
              />
            </label>

            <button
              className="c-button"
              data-variant="primary"
              disabled={!avatar.isSelected || mutation.isLoading}
              type="submit"
            >
              {mutation.isLoading ? t("profile.avatar.upload.cta.loading") : t("profile.avatar.upload.cta")}
            </button>

            {avatar.isSelected && (
              <button
                className="c-button"
                data-animation="grow-fade-in"
                data-variant="bare"
                disabled={mutation.isLoading}
                onClick={exec([avatar.actions.clearFile, mutation.reset])}
                type="button"
              >
                {t("app.clear")}
              </button>
            )}
          </div>

          <div data-color="neutral-500" data-fs="xs">
            {t("profile.avatar.hint")}
          </div>

          {avatar.isSelected && (
            <output data-animation="grow-fade-in" data-color="neutral-300" data-fs="xs">
              {t("profile.avatar.selected", { name: avatar.data.name })}
            </output>
          )}

          {mutation.isError && (
            <output data-animation="grow-fade-in" data-color="danger-400" data-fs="xs">
              {t("profile.avatar.upload.error")}
            </output>
          )}
        </form>
      </div>
    </section>
  );
}
