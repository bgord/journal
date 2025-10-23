import { useSupportedLanguages, useTranslations } from "@bgord/ui";
import { Select } from "./select";

export function LanguageSelector() {
  const supportedLanguages = useSupportedLanguages();
  const t = useTranslations();

  return (
    <div data-stack="x" data-cross="center" data-gap="3">
      <Select data-disp="flex">
        {Object.keys(supportedLanguages).map((language) => (
          <option key={language} value={language}>
            {t(`profile.change_language.${language}.value`)}
          </option>
        ))}
      </Select>
    </div>
  );
}
