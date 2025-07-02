import type * as Schema from "+infra/schema";

type WeeklyReviewInsightsPromptType = [
  { role: "system"; content: string },
  { role: "user"; content: string },
];

export class WeeklyReviewInsightsPrompt {
  constructor(private readonly entries: Schema.SelectEmotionJournalEntries[]) {}

  generate(): WeeklyReviewInsightsPromptType {
    const content = `Generate insights for these ${this.entries.length} journal entries.`;

    return [
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      { role: "user", content },
    ];
  }
}
