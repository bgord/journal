import { describe, expect, spyOn, test } from "bun:test";
import { SupportedLanguages } from "../infra/i18n";
import { OpenAI, OpenAiClient } from "../infra/open-ai-client";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const prompt = new Emotions.Services.EntryAlarmAdvicePromptBuilder(
  mocks.partialEntry,
  Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  SupportedLanguages.en,
).generate();

describe("OpenAiClient", () => {
  test("request", async () => {
    const openAiCreate = spyOn(
      OpenAI.responses,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ output_text: mocks.advice.get() });

    const client = new OpenAiClient();
    const result = await client.request(prompt);

    expect(openAiCreate).toHaveBeenCalledWith({
      model: "gpt-4o",
      instructions: prompt.read()[0].content,
      input: prompt.read()[1].content,
      max_output_tokens: Emotions.VO.Advice.MaximumLength,
    });
    expect(result).toEqual(mocks.advice);
  });
});
