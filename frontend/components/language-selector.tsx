import * as UI from "@bgord/ui";
import { SupportedLanguages } from "../../infra/i18n";
import { Select } from "../components/select";

export function LanguageSelector() {
  const languageSelector = UI.useLanguageSelector(SupportedLanguages);

  return (
    <div data-stack="x" data-cross="center" data-gap="3">
      <Select data-disp="flex" {...languageSelector.input.props}>
        {languageSelector.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        ))}
      </Select>
    </div>
  );
}
