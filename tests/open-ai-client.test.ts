import { describe, expect, spyOn, test } from "bun:test";
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

describe("OpenAiClient", () => {
  test("request", async () => {
    const openAiCreate = spyOn(
      infra.OpenAI.responses,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ output_text: "anything" });

    const client = new infra.OpenAiClient();
    const result = await client.request(prompt.generate());

    expect(openAiCreate).toHaveBeenCalledWith({
      model: "gpt-4o",
      instructions: prompt.generate()[0].content,
      input: prompt.generate()[1].content,
      max_output_tokens: 500,
    });
    expect(result).toEqual("anything");

    openAiCreate.mockRestore();
  });
});
