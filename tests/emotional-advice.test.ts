import { describe, expect, spyOn, test } from "bun:test";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const negativeEmotionExtremeIntensityEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
  mocks.GenericSituationLoggedEvent,
  mocks.NegativeEmotionExtremeIntensityLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

describe("EmotionalAdvice", () => {
  test("openai - ask", async () => {
    const openAiCreate = spyOn(
      infra.OpenAI.responses,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ output_text: "anything" });

    const client = new infra.OpenAiClient();

    const EmotionalAdvice = new Emotions.Services.EmotionalAdvice(
      client,
      negativeEmotionExtremeIntensityEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
    );

    const advice = await EmotionalAdvice.ask();

    expect(advice).toEqual("anything");

    openAiCreate.mockRestore();
  });

  test("openai - ask", async () => {
    const anthropicCreate = spyOn(
      infra.AnthropicAi.messages,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ content: "anything" });

    const client = new infra.AnthropicAiClient();

    const EmotionalAdvice = new Emotions.Services.EmotionalAdvice(
      client,
      negativeEmotionExtremeIntensityEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
    );

    const advice = await EmotionalAdvice.ask();

    expect(advice).toEqual("anything");

    anthropicCreate.mockRestore();
  });
});
