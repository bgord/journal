import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import { useRef, useState } from "react";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export function ProfileAvatar() {
  const t = UI.useTranslations();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formElement = event.currentTarget;
    const selectedFile = fileInputRef.current?.files?.[0];
    if (!selectedFile) return;

    const formData = new FormData();
    formData.set("file", selectedFile, selectedFile.name);

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/preferences/profile-avatar/update`, {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const responseText = await response.text().catch(() => "");
        throw new Error(responseText || `Upload failed with status ${response.status}`);
      }

      if (fileInputRef.current) fileInputRef.current.value = "";
      formElement.reset();
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section data-stack="y" data-gap="4">
      <div data-stack="x" data-cross="center" data-gap="3">
        <Icons.UserCircle data-size="md" />
        <div>{t("profile.avatar.header")}</div>
      </div>

      <div data-stack="x" data-gap="6" data-cross="center">
        <img
          src={`${import.meta.env.VITE_API_URL}/profile-avatar/get`}
          alt={t("profile.avatar.alt")}
          width={88}
          height={88}
          style={{ borderRadius: 9999, objectFit: "cover" }}
          data-bc="neutral-700"
          data-bwb="hairline"
        />

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div data-stack="x" data-gap="3" data-cross="center">
            <label
              data-disp="flex"
              data-main="center"
              data-cross="center"
              className="c-button"
              data-variant="secondary"
            >
              <span>{t("profile.avatar.select_file.cta")}</span>
              <input
                ref={fileInputRef}
                name="file"
                type="file"
                accept={ALLOWED_MIME_TYPES.join(",")}
                className="c-file-explorer"
                required
              />
            </label>

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={isSubmitting || !fileInputRef.current?.files?.length}
            >
              {t("profile.avatar.upload.cta")}
            </button>
          </div>

          <div data-fs="xs" data-color="neutral-500" data-mt="2">
            {t("profile.avatar.hint")}
          </div>
        </form>
      </div>
    </section>
  );
}

export default ProfileAvatar;
