import { useTranslations } from "@bgord/ui";
import * as Icons from "iconoir-react";
import { Avatar, AvatarSize } from "../components/avatar";

export function ProfileAvatarChange() {
  const t = useTranslations();

  return (
    <section data-stack="y" data-gap="4">
      <div data-stack="x" data-cross="center" data-gap="3">
        <Icons.UserCircle data-size="md" />
        <div>{t("profile.avatar.header")}</div>
      </div>

      <div data-stack="x" data-gap="6" data-cross="center">
        <Avatar size={AvatarSize.large} />
      </div>
    </section>
  );
}
