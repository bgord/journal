import type * as Aggregates from "../aggregates";
import * as Services from "../services";
import * as VO from "../value-objects";

export class EmotionalAdvice {
  constructor(
    private readonly AiClient: Services.AiClient,
    private readonly entry: Aggregates.EmotionJournalEntry,
    private readonly alarmName: VO.AlarmNameOption,
  ) {}

  async ask() {
    const summary = this.entry.summarize();

    const prompt = new Services.EmotionalAdvicePrompt(summary, this.alarmName).generate();

    return await this.AiClient.request(prompt);
  }
}
