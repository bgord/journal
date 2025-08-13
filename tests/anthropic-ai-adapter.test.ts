import { describe, expect, spyOn, test } from "bun:test";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { AnthropicAi, AnthropicAiAdapter } from "+infra/anthropic-ai-adapter";
import { SupportedLanguages } from "+infra/i18n";
import * as mocks from "./mocks";

const prompt = new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
  mocks.partialEntry,
  Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  SupportedLanguages.en,
).generate();

describe("AnthropicAiClient", () => {
  test("request", async () => {
    const anthropicCreate = spyOn(
      AnthropicAi.messages,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ content: mocks.advice.get() });

    const client = new AnthropicAiAdapter();
    const result = await client.request(prompt);

    expect(anthropicCreate).toHaveBeenCalledWith({
      max_tokens: AI.Advice.MaximumLength,
      messages: [prompt.read()[1]],
      system: prompt.read()[0].content,
      model: "claude-3-5-sonnet-latest",
    });
    expect(result).toEqual(mocks.advice);
  });
});
