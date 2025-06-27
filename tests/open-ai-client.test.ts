import { describe, expect, jest, spyOn, test } from "bun:test";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const prompt = new Emotions.Services.EmotionalAdvicePrompt(
  mocks.partialEntry,
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
      max_output_tokens: Emotions.VO.EmotionalAdvice.MaximumLength,
    });
    expect(result).toEqual("anything");

    jest.restoreAllMocks();
  });
});
