import { useTranslations } from "@bgord/ui";
import { Language } from "iconoir-react";
import * as UI from "../components";

export function ProfileLanguageSelector() {
  const t = useTranslations();

  return (
    <div data-stack="y" data-gap="5">
      <div data-stack="x" data-cross="center" data-gap="3">
        <Language data-size="md" />
        <div>{t("profile.change_language.header")}</div>
      </div>

      <UI.LanguageSelector />
    </div>
  );
}
