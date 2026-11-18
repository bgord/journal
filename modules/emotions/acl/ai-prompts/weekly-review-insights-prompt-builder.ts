import * as AI from "+ai";
import type { LanguagesType } from "+languages";
import type * as VO from "+emotions/value-objects";

const content: Record<LanguagesType, (entries: ReadonlyArray<VO.EntrySnapshot>) => string> = {
  en: (entries: ReadonlyArray<VO.EntrySnapshot>) => `Generate insights for these ${entries.length} entries.`,
  pl: (entries: ReadonlyArray<VO.EntrySnapshot>) => `Podsumuj te ${entries.length} wpisów.`,
};

export class WeeklyReviewInsightsPromptBuilder {
  constructor(
    private readonly entries: ReadonlyArray<VO.EntrySnapshot>,
    private readonly language: LanguagesType,
  ) {}

  generate(): AI.Prompt {
    return new AI.Prompt(content[this.language](this.entries));
  }
}
