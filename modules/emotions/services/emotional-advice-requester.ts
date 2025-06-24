import type * as Aggregates from "../aggregates";
import * as Services from "../services";
import * as VO from "../value-objects";

export class EmotionalAdviceRequester {
  constructor(
    private readonly AiClient: Services.AiClient,
    private readonly entry: Aggregates.EmotionJournalEntry,
    private readonly alarmName: VO.AlarmNameOption,
  ) {}

  async ask(): Promise<VO.EmotionalAdvice> {
    const summary = this.entry.summarize();

    const prompt = new Services.EmotionalAdvicePrompt(summary, this.alarmName).generate();

    const advice = await this.AiClient.request(prompt);

    return new VO.EmotionalAdvice(advice);
  }
}
