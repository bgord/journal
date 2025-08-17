import * as AI from "+ai";
import * as VO from "+emotions/value-objects";
import { SupportedLanguages } from "+infra/i18n";

const content: Record<SupportedLanguages, (entries: VO.EntrySnapshot[]) => string> = {
  [SupportedLanguages.en]: (entries: VO.EntrySnapshot[]) =>
    `Generate insights for these ${entries.length} entries.`,
  [SupportedLanguages.pl]: (entries: VO.EntrySnapshot[]) => `Podsumuj te ${entries.length} wpisów.`,
};

export class WeeklyReviewInsightsPromptBuilder {
  constructor(
    private readonly entries: VO.EntrySnapshot[],
    private readonly language: SupportedLanguages,
  ) {}

  generate(): AI.Prompt {
    return new AI.Prompt(content[this.language](this.entries));
  }
}
