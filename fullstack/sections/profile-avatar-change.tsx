import * as UI from "@bgord/ui";
import * as Icons from "iconoir-react";

export function ProfileAvatarChange() {
  const t = UI.useTranslations();

  return (
    <section data-stack="y" data-gap="4">
      <div data-stack="x" data-cross="center" data-gap="3">
        <Icons.UserCircle data-size="md" />
        <div>{t("profile.avatar.header")}</div>
      </div>

      <div data-stack="x" data-gap="6" data-cross="center">
        <img
          src="/api/profile-avatar/get"
          alt=""
          data-bc="neutral-700"
          data-bwb="hairline"
          data-br="pill"
          data-object-fit="cover"
          {...UI.Rhythm().times(8).style.square}
        />
      </div>
    </section>
  );
}
