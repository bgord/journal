import * as bg from "@bgord/bun";

type Dependencies = { FileReaderJson: bg.FileReaderJsonPort };

export function createTranslationsProvider(deps: Dependencies): bg.TranslationsProviderPort {
  return new bg.TranslationsProviderJsonAdapter(deps);
}
