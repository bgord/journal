import * as bg from "@bgord/ui";
import { SupportedLanguages } from "../../infra/i18n";
import { Select } from "../components/select";

export function LanguageSelector() {
  const languageSelector = bg.useLanguageSelector(SupportedLanguages);

  return (
    <Select {...languageSelector.input.props}>
      {languageSelector.options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.value}
        </option>
      ))}
    </Select>
  );
}
