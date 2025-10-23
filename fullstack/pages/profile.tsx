import { useTranslations } from "@bgord/ui";
import { Language, ProfileCircle } from "iconoir-react";
import { LanguageSelector } from "../components/language-selector";

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
      <header data-stack="x" data-gap="3" data-pb="5" data-bwb="hairline" data-bcb="neutral-800">
        <ProfileCircle data-size="md" data-color="brand-300" />
        <h2 data-fw="bold" data-fs="base">
          Profile
        </h2>
      </header>

      <div data-stack="y" data-gap="5">
        <div data-stack="x" data-cross="center" data-gap="3">
          <Language data-size="md" />
          <div>{t("profile.change_language.header")}</div>
        </div>

        <LanguageSelector />
      </div>
    </main>
  );
}
