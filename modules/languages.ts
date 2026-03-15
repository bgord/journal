import * as bg from "@bgord/bun";
import { SupportedLanguages } from "./supported-languages";

export type LanguagesType = (typeof SupportedLanguages)[number];

export const languages = new bg.Languages(SupportedLanguages, "en");
