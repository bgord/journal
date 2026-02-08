import * as AI from "+ai";
import { SupportedLanguages } from "+languages";
import type * as VO from "+emotions/value-objects";

const content: Record<SupportedLanguages, (entries: ReadonlyArray<VO.EntrySnapshot>) => string> = {
  [SupportedLanguages.en]: (entries: ReadonlyArray<VO.EntrySnapshot>) =>
    `Generate insights for these ${entries.length} entries.`,
  [SupportedLanguages.pl]: (entries: ReadonlyArray<VO.EntrySnapshot>) =>
    `Podsumuj te ${entries.length} wpisów.`,
};

export class WeeklyReviewInsightsPromptBuilder {
  constructor(
    private readonly entries: ReadonlyArray<VO.EntrySnapshot>,
    private readonly language: SupportedLanguages,
  ) {}

  generate(): AI.Prompt {
    return new AI.Prompt(content[this.language](this.entries));
  }
}
