import * as bg from "@bgord/bun";

const SupportedLanguages = ["en", "pl"] as const;
export type LanguagesType = (typeof SupportedLanguages)[number];

export const languages = new bg.Languages(SupportedLanguages, "en");
