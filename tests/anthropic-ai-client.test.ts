import { describe, expect, jest, spyOn, test } from "bun:test";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const negativeEmotionExtremeIntensityEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
  mocks.GenericSituationLoggedEvent,
  mocks.NegativeEmotionExtremeIntensityLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

const prompt = new Emotions.Services.EmotionalAdvicePrompt(
  negativeEmotionExtremeIntensityEntry.summarize(),
  Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
);

describe("AnthropicAiClient", () => {
  test("request", async () => {
    const anthropicCreate = spyOn(
      infra.AnthropicAi.messages,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ content: "anything" });

    const client = new infra.AnthropicAiClient();
    const result = await client.request(prompt.generate());

    expect(anthropicCreate).toHaveBeenCalledWith({
      max_tokens: Emotions.VO.EmotionalAdvice.MaximumLength,
      messages: [prompt.generate()[1]],
      system: prompt.generate()[0].content,
      model: "claude-3-5-sonnet-latest",
    });
    expect(result).toEqual("anything");

    jest.restoreAllMocks();
  });
});
