import * as UI from "@bgord/ui";
import { Language } from "iconoir-react";
import { SupportedLanguages } from "../../infra/i18n";
import { Select } from "../components/select";

export function LanguageSelector() {
  const languageSelector = UI.useLanguageSelector(SupportedLanguages);

  return (
    <div data-display="flex" data-cross="center" data-gap="3" data-ml="auto" data-mr="5">
      <Language width={20} height={20} data-color="brand-400" />

      <Select data-display="flex" {...languageSelector.input.props}>
        {languageSelector.options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.value}
          </option>
        ))}
      </Select>
    </div>
  );
}
