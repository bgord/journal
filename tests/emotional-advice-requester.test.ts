import { describe, expect, spyOn, test } from "bun:test";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const negativeEmotionExtremeIntensityEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
  mocks.GenericSituationLoggedEvent,
  mocks.NegativeEmotionExtremeIntensityLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

describe("EmotionalAdviceRequester", () => {
  test("openai - ask", async () => {
    const openAiCreate = spyOn(
      infra.OpenAI.responses,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ output_text: "anything" });

    const client = new infra.OpenAiClient();

    const EmotionalAdviceRequester = new Emotions.Services.EmotionalAdviceRequester(
      client,
      negativeEmotionExtremeIntensityEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
    );

    const advice = await EmotionalAdviceRequester.ask();

    expect(advice.get()).toEqual("anything");

    openAiCreate.mockRestore();
  });

  test("openai - ask", async () => {
    const anthropicCreate = spyOn(
      infra.AnthropicAi.messages,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ content: "anything" });

    const client = new infra.AnthropicAiClient();

    const EmotionalAdviceRequester = new Emotions.Services.EmotionalAdviceRequester(
      client,
      negativeEmotionExtremeIntensityEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
    );

    const advice = await EmotionalAdviceRequester.ask();

    expect(advice.get()).toEqual("anything");

    anthropicCreate.mockRestore();
  });
});
