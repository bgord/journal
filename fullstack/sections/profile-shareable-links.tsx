import { useTranslations } from "@bgord/ui";
import { ShareIos } from "iconoir-react";

export function ProfileShareableLinks() {
  const t = useTranslations();

  return (
    <div data-stack="y" data-gap="5">
      <div data-stack="x" data-cross="center" data-gap="3">
        <ShareIos data-size="md" />
        <div>{t("profile.shareable_links.header")}</div>
      </div>
    </div>
  );
}
