import type * as Aggregates from "../aggregates";
import * as Services from "../services";
import * as VO from "../value-objects";

// TODO: Make this class EmotionalAdviceRequester,
// extract the type below to a VO.
export type EmotionalAdviceType = string;

export class EmotionalAdvice {
  constructor(
    private readonly AiClient: Services.AiClient,
    private readonly entry: Aggregates.EmotionJournalEntry,
    private readonly alarmName: VO.AlarmNameOption,
  ) {}

  async ask(): Promise<EmotionalAdviceType> {
    const summary = this.entry.summarize();

    const prompt = new Services.EmotionalAdvicePrompt(summary, this.alarmName).generate();

    return await this.AiClient.request(prompt);
  }
}
