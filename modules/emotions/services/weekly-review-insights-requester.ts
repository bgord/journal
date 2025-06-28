import type * as Schema from "../../../infra/schema";
import * as Services from "../services";
import * as VO from "../value-objects";

export class WeeklyReviewInsightsRequester {
  constructor(
    private readonly AiClient: Services.AiClient,
    private readonly entries: Schema.SelectEmotionJournalEntries[],
  ) {}

  async ask(): Promise<VO.EmotionalAdvice> {
    const prompt = new Services.WeeklyReviewInsightsPrompt(this.entries).generate();

    const advice = await this.AiClient.request(prompt);

    return new VO.EmotionalAdvice(advice);
  }
}
