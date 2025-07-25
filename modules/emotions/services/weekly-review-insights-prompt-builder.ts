import * as VO from "+emotions/value-objects";
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

  generate(): VO.Prompt {
    return new VO.Prompt(content[this.language](this.entries));
  }
}
