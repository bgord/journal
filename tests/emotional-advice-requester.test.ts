import { describe, expect, jest, spyOn, test } from "bun:test";
import * as infra from "../infra";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("EmotionalAdviceRequester", () => {
  test("openai - ask", async () => {
    spyOn(
      infra.OpenAI.responses,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ output_text: "anything" });

    const client = new infra.OpenAiClient();

    const EmotionalAdviceRequester = new Emotions.Services.EmotionalAdviceRequester(
      client,
      mocks.fullEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
    );

    const advice = await EmotionalAdviceRequester.ask();

    expect(advice.get()).toEqual("anything");

    jest.restoreAllMocks();
  });

  test("openai - ask", async () => {
    spyOn(
      infra.AnthropicAi.messages,
      "create",
      // @ts-expect-error
    ).mockResolvedValue({ content: "anything" });

    const client = new infra.AnthropicAiClient();

    const EmotionalAdviceRequester = new Emotions.Services.EmotionalAdviceRequester(
      client,
      mocks.fullEntry,
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
    );

    const advice = await EmotionalAdviceRequester.ask();

    expect(advice.get()).toEqual("anything");

    jest.restoreAllMocks();
  });
});
