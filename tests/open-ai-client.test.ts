import { describe, expect, jest, spyOn, test } from "bun:test";
import { SupportedLanguages } from "../infra/i18n";
import { OpenAI, OpenAiClient } from "../infra/open-ai-client";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const prompt = new Emotions.Services.EmotionalAdvicePrompt(
  mocks.partialEntry,
  Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  SupportedLanguages.en,
);

describe("OpenAiClient", () => {
  test("request", async () => {
    const openAiCreate = spyOn(
      OpenAI.responses,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ output_text: "anything" });

    const client = new OpenAiClient();
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
