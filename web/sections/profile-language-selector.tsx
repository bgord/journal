import { useTranslations } from "@bgord/ui";
import { Language } from "iconoir-react";
import { LanguageSelector } from "../components";

export function ProfileLanguageSelector() {
  const t = useTranslations();

  return (
    <div data-gap="5" data-stack="y">
      <div data-cross="center" data-gap="3" data-stack="x">
        <Language data-size="md" />
        <div>{t("profile.change_language.header")}</div>
      </div>

      <LanguageSelector />
    </div>
  );
}
