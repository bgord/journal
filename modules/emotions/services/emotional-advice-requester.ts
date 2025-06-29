import type * as Schema from "../../../infra/schema";
import * as Services from "../services";
import * as VO from "../value-objects";

export class EmotionalAdviceRequester {
  constructor(
    private readonly AiClient: Services.AiClient,
    private readonly entry: Schema.SelectEmotionJournalEntries,
    private readonly alarmName: VO.AlarmNameOption,
  ) {}

  async ask(): Promise<VO.EmotionalAdvice> {
    const prompt = new Services.EmotionalAdvicePrompt(this.entry, this.alarmName).generate();

    const advice = await this.AiClient.request(prompt);

    return new VO.EmotionalAdvice(advice);
  }
}
