import * as UI from "@bgord/ui";
import Cookie from "js-cookie";
import React from "react";
import * as RR from "react-router";

import { SupportedLanguages } from "../../infra/i18n";
import * as Components from "../components";

export function LanguageSelector() {
  const revalidator = RR.useRevalidator();
  const defaultValue = Cookie.get("language") ?? SupportedLanguages.en;
  const language = UI.useField({ name: "language", defaultValue: defaultValue });

  React.useEffect(() => {
    Cookie.set("language", language.value);
    revalidator.revalidate();
  }, [language.value]);

  return (
    <Components.Select {...language.input.props}>
      {Object.keys(SupportedLanguages).map((option) => (
        <option key={option}>{option}</option>
      ))}
    </Components.Select>
  );
}
