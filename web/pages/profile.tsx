import { useTranslations } from "@bgord/ui";
import { ProfileCircle } from "iconoir-react";
import { Separator } from "../components";
import * as Sections from "../sections";

/** @public */
export function Profile() {
  const t = useTranslations();

  return (
    <main
      data-stack="y"
      data-gap="8"
      data-my="8"
      data-mx="auto"
      data-p="8"
      data-width="100%"
      data-maxw="md"
      data-br="sm"
      data-color="neutral-100"
      data-bg="neutral-900"
    >
      <header data-stack="x" data-gap="3">
        <ProfileCircle data-size="md" data-color="brand-300" />
        <h2 data-fw="bold" data-fs="base">
          {t("profile.header")}
        </h2>
      </header>
      <Separator />
      <Sections.ProfileAvatarChange />
      <Separator />
      <Sections.ProfileAiUsage />
      <Separator />
      <Sections.ProfileShareableLinkList />
      <Separator />
      <Sections.ProfileLanguageSelector />
      <Separator />
      <Sections.ProfileDataExport />
      <Separator />
      <Sections.ProfilePasswordChange />
      <Separator />
      <Sections.ProfileAccountDelete />
    </main>
  );
}
