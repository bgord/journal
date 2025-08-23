import * as UI from "@bgord/ui";
import { SupportedLanguages } from "../../modules/supported-languages";
import { Select } from "../components/select";

export function LanguageSelector() {
  const languageSelector = UI.useLanguageSelector(SupportedLanguages);
  const t = UI.useTranslations();

  return (
    <div data-stack="x" data-cross="center" data-gap="3">
      <Select data-disp="flex" {...languageSelector.input.props}>
        {languageSelector.options.map((option) => (
          <option key={option.value} value={option.value}>
            {t(`profile.change_language.${option.value}.value`)}
          </option>
        ))}
      </Select>
    </div>
  );
}
