import { useTranslations } from "@bgord/ui";
import { ProfileCircle } from "iconoir-react";
import * as UI from "../components";
import * as Sections from "../sections";

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
      <UI.Separator />
      <Sections.ProfileAvatarChange />
      <UI.Separator />
      <Sections.ProfileAiUsage />
      <UI.Separator />
      <Sections.ProfileShareableLinks />
      <UI.Separator />
      <Sections.ProfileLanguageSelector />
      <UI.Separator />
      <Sections.ProfileDataExport />
      <UI.Separator />
      <Sections.ProfilePasswordChange />
      <UI.Separator />
      <Sections.ProfileAccountDelete />
    </main>
  );
}
