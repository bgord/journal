import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";
import * as RR from "react-router";
import { useEffect, useRef, useState } from "react";

const ALLOWED_MIME_TYPES = ["image/png", "image/jpeg", "image/webp"] as const;

export function ProfileAvatar() {
  const t = UI.useTranslations();
  const navigation = RR.useNavigation();

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [hasFileSelected, setHasFileSelected] = useState(false);

  const isSubmitting =
    navigation.state === "submitting" && navigation.formData?.get("intent") === "profile_avatar_update";

  useEffect(() => {
    if (navigation.state === "idle" && fileInputRef.current) {
      fileInputRef.current.value = "";
      setHasFileSelected(false);
    }
  }, [navigation.state]);

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

        {/* Use RR.Form to hit the route action */}
        <RR.Form method="post" encType="multipart/form-data">
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
                onChange={(e) => setHasFileSelected(Boolean(e.currentTarget.files?.length))}
              />
            </label>

            <input type="hidden" name="intent" value="profile_avatar_update" />

            <button
              type="submit"
              className="c-button"
              data-variant="primary"
              disabled={isSubmitting || !hasFileSelected}
            >
              {t("profile.avatar.upload.cta")}
            </button>
          </div>

          <div data-fs="xs" data-color="neutral-500" data-mt="2">
            {t("profile.avatar.hint")}
          </div>
        </RR.Form>
      </div>
    </section>
  );
}

export default ProfileAvatar;
