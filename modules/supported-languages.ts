/** @public */
export enum SupportedLanguages {
  en = "en",
  pl = "pl",
}

export type SupportedLanguagesType = `${SupportedLanguages}`;

export const SUPPORTED_LANGUAGES = Object.values(SupportedLanguages) as readonly SupportedLanguages[];
