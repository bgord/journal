import * as AI from "+ai";
import { SupportedLanguages } from "+infra/i18n";
import type * as Schema from "+infra/schema";

const content: Record<SupportedLanguages, (entries: Schema.SelectEntries[]) => string> = {
  [SupportedLanguages.en]: (entries: Schema.SelectEntries[]) =>
    `Generate insights for these ${entries.length} entries.`,
  [SupportedLanguages.pl]: (entries: Schema.SelectEntries[]) => `Podsumuj te ${entries.length} wpisów.`,
};

export class WeeklyReviewInsightsPromptBuilder {
  constructor(
    private readonly entries: Schema.SelectEntries[],
    private readonly language: SupportedLanguages,
  ) {}

  generate(): AI.Prompt {
    return new AI.Prompt(content[this.language](this.entries));
  }
}
