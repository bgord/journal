import { describe, expect, spyOn, test } from "bun:test";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { AiClientOpenAiAdapter, OpenAI } from "+infra/adapters/ai/ai-client-open-ai.adapter";
import { SupportedLanguages } from "+infra/i18n";
import * as mocks from "./mocks";

const prompt = new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
  mocks.partialEntry,
  Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  SupportedLanguages.en,
).generate();

describe("AiClientOpenAi", () => {
  test("request", async () => {
    const openAiCreate = spyOn(
      OpenAI.responses,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ output_text: mocks.advice.get() });

    const client = new AiClientOpenAiAdapter();
    const result = await client.request(prompt);

    expect(openAiCreate).toHaveBeenCalledWith({
      model: "gpt-4o",
      instructions: prompt.read()[0].content,
      input: prompt.read()[1].content,
      max_output_tokens: AI.Advice.MaximumLength,
    });
    expect(result).toEqual(mocks.advice);
  });
});
