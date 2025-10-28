import { useTranslations } from "@bgord/ui";
import { DownloadCircle, Language, ProfileCircle } from "iconoir-react";
import * as UI from "../components";
import { ProfileAccountDelete } from "../sections/profile-account-delete";
import { ProfileAiUsage } from "../sections/profile-ai-usage";
import { ProfileAvatarChange } from "../sections/profile-avatar-change";
import { ProfilePasswordChange } from "../sections/profile-password-change";
import { ProfileShareableLinks } from "../sections/profile-shareable-links";

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

      <ProfileAvatarChange />

      <UI.Separator />

      <ProfileAiUsage />

      <UI.Separator />

      <ProfileShareableLinks />

      <UI.Separator />

      <div data-stack="y" data-gap="5">
        <div data-stack="x" data-cross="center" data-gap="3">
          <Language data-size="md" />
          <div>{t("profile.change_language.header")}</div>
        </div>

        <UI.LanguageSelector />
      </div>

      <UI.Separator />

      <div data-stack="y" data-gap="5">
        <div data-stack="x" data-cross="center" data-gap="3">
          <DownloadCircle data-size="md" />
          <div>{t("profile.export_all_data.header")}</div>
        </div>

        <a
          type="button"
          href="/api/entry/export-data"
          download
          target="_blank"
          rel="noopener noreferer"
          className="c-button"
          data-variant="secondary"
          data-disp="flex"
          data-main="center"
          data-cross="center"
          data-mr="auto"
        >
          {t("profile.export_all_data.cta")}
        </a>
      </div>

      <UI.Separator />

      <ProfilePasswordChange />

      <UI.Separator />

      <ProfileAccountDelete />
    </main>
  );
}
