import * as VO from "+emotions/value-objects";
import type * as Schema from "+infra/schema";

export class WeeklyReviewInsightsPromptBuilder {
  constructor(private readonly entries: Schema.SelectEntries[]) {}

  generate(): VO.Prompt {
    const content = `Generate insights for these ${this.entries.length} entries.`;

    return new VO.Prompt(content);
  }
}
