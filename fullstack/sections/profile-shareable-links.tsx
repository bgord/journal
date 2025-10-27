import { useTranslations } from "@bgord/ui";
import { ShareIos } from "iconoir-react";
import { ProfileShareableLinkCreate } from "./profile-shareable-link-create";

export function ProfileShareableLinks() {
  const t = useTranslations();

  return (
    <div data-stack="y" data-gap="5">
      <div data-stack="x" data-cross="center" data-gap="3">
        <ShareIos data-size="md" />
        <div>{t("profile.shareable_links.header")}</div>
        <ProfileShareableLinkCreate />
      </div>
    </div>
  );
}
