import { describe, expect, spyOn, test } from "bun:test";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { AiClientOpenAiAdapter } from "+infra/adapters/ai/ai-client-open-ai.adapter";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const prompt = new Emotions.ACL.AiPrompts.EntryAlarmAdvicePromptBuilder(
  mocks.partialEntry,
  Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
  SupportedLanguages.en,
).generate();

describe("AiClientOpenAi", async () => {
  const di = await bootstrap(mocks.Env);

  const client = new AiClientOpenAiAdapter(di.Env.OPEN_AI_API_KEY);

  test("request", async () => {
    const openAiCreate = spyOn(
      client.OpenAI.responses,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ output_text: mocks.advice.get() });

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
