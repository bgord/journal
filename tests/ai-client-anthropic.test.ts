import { describe, expect, spyOn, test } from "bun:test";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { AiClientAnthropicAdapter } from "+infra/adapters/ai/ai-client-anthropic.adapter";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const prompt = new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
  mocks.partialEntry,
  Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  SupportedLanguages.en,
).generate();

describe("AiClientAnthropic", async () => {
  const di = await bootstrap(mocks.Env);

  const client = new AiClientAnthropicAdapter(di.Env.ANTHROPIC_AI_API_KEY);

  test("request", async () => {
    const anthropicCreate = spyOn(
      client.Anthropic.messages,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ content: mocks.advice.get() });

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
