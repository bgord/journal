import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import { useRef, useState } from "react";
import * as RR from "react-router";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export function ProfileAvatar() {
  const translations = UI.useTranslations();
  const revalidator = RR.useRevalidator();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [cacheBuster, setCacheBuster] = useState<number>(Date.now());

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);

    const formElement = event.currentTarget;
    const selectedFile = fileInputRef.current?.files?.[0];
    if (!selectedFile) return;

    // Optional client-side validation (server still validates)
    if (!ALLOWED_MIME_TYPES.includes(selectedFile.type as any)) {
      setErrorMessage(translations("profile.avatar.validation.unsupported_type"));
      formElement.reset();
      return;
    }

    const formData = new FormData();
    formData.set("file", selectedFile, selectedFile.name);

    setIsSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/preferences/profile-avatar/update`, {
        method: "POST",
        body: formData,
        // IMPORTANT: do NOT set Content-Type. Let the browser set the multipart boundary.
        credentials: "include", // ensure session cookies are sent to API origin
      });

      if (!response.ok) {
        const responseText = await response.text().catch(() => "");
        throw new Error(responseText || `Upload failed with status ${response.status}`);
      }

      // Bust caches on the <img>, and revalidate the route if it reads avatar-related data
      setCacheBuster(Date.now());
      revalidator.revalidate();

      // Clear the file input
      if (fileInputRef.current) fileInputRef.current.value = "";
      formElement.reset();
    } catch (problem) {
      setErrorMessage(problem instanceof Error ? problem.message : translations("app.unknown_error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section data-stack="y" data-gap="4">
      <div data-stack="x" data-cross="center" data-gap="3">
        <Icons.UserCircle data-size="md" />
        <div>{translations("profile.avatar.header")}</div>
      </div>

      <div data-stack="x" data-gap="6" data-cross="center">
        {/* Current avatar; server should set ETag/Last-Modified, we also add ?cb= to bypass stubborn caches */}
        <img
          src={`${import.meta.env.VITE_API_URL}/profile-avatar/get`}
          alt={translations("profile.avatar.alt")}
          width={88}
          height={88}
          style={{ borderRadius: 9999, objectFit: "cover" }}
          data-bc="neutral-700"
          data-bwb="hairline"
        />

        {/* Direct-to-API form */}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div data-stack="x" data-gap="3" data-cross="center">
            <label className="c-button" data-variant="secondary">
              <Icons.Upload data-size="md" />
              <span data-ml="2">{translations("profile.avatar.select_file.cta")}</span>
              <input
                ref={fileInputRef}
                name="file"
                type="file"
                accept={ALLOWED_MIME_TYPES.join(",")}
                style={{ display: "none" }}
                required
              />
            </label>

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={isSubmitting || !fileInputRef.current?.files?.length}
            >
              {isSubmitting
                ? translations("profile.avatar.uploading")
                : translations("profile.avatar.upload.cta")}
            </button>
          </div>

          <div data-fs="xs" data-color="neutral-500" data-mt="2">
            {translations("profile.avatar.hint", { types: "PNG, JPEG, WEBP" })}
          </div>

          {errorMessage && (
            <div role="status" data-fs="xs" data-color="danger-400" data-mt="2">
              {errorMessage}
            </div>
          )}
        </form>
      </div>
    </section>
  );
}

export default ProfileAvatar;
