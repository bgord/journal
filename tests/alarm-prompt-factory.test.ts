import { describe, expect, spyOn, test } from "bun:test";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("AlarmPromptFactory", async () => {
  const di = await bootstrap();

  test("entry", async () => {
    using _ = spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);

    const result = await new Emotions.ACL.AiPrompts.AlarmPromptFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.entryDetection);

    expect(result).toEqual(
      new AI.Prompt(
        "Here is a summary of an entry from my AI journal app, it triggered an NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM alarm. Situation (achievement): I finished a project. Emotion: anger, intensity 5/5. As a compassionate mental health coach, please suggest two brief coping strategies for this situation.",
      ),
    );
  });

  test("entry - missing", async () => {
    using _ = spyOn(di.Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(undefined);

    const result = await new Emotions.ACL.AiPrompts.AlarmPromptFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.entryDetection);

    expect(result).toEqual(null);
  });

  test("inactivity", async () => {
    const result = await new Emotions.ACL.AiPrompts.AlarmPromptFactory(
      di.Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.inactivityDetection);

    expect(result).toEqual(new AI.Prompt(`Inactive for ${mocks.inactivityTrigger.inactivityDays} days`));
  });

  test("unknown type", async () => {
    expect(
      async () =>
        await new Emotions.ACL.AiPrompts.AlarmPromptFactory(
          di.Adapters.Emotions.EntrySnapshot,
          SupportedLanguages.en,
          // @ts-expect-error
        ).create(new Emotions.VO.AlarmDetection("unknown", "unknown")),
    ).toThrow("alarm.prompt.factory.unknown.trigger");
  });
});
