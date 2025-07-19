import type * as Schema from "+infra/schema";
import { Prompt } from "./prompt-template";

export class WeeklyReviewInsightsPromptBuilder {
  constructor(private readonly entries: Schema.SelectEntries[]) {}

  generate(): Prompt {
    const content = `Generate insights for these ${this.entries.length} entries.`;

    return new Prompt(content);
  }
}
