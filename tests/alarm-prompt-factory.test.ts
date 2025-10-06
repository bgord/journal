import { describe, expect, spyOn, test } from "bun:test";
import * as AI from "+ai";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

describe("AlarmPromptFactory", () => {
  test("entry", async () => {
    spyOn(Adapters.Emotions.EntrySnapshot, "getById").mockResolvedValue(mocks.partialEntry);

    const result = await new Emotions.ACL.AiPrompts.AlarmPromptFactory(
      Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.entryDetection);

    expect(result).toEqual(
      new AI.Prompt(
        "Here is a summary of an entry from my AI journal app, it triggered an NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM alarm. Situation (achievement): I finished a project. Emotion: anger, intensity 5/5. As a compassionate mental health coach, please suggest two brief coping strategies for this situation.",
      ),
    );
  });

  test("inactivity", async () => {
    const result = await new Emotions.ACL.AiPrompts.AlarmPromptFactory(
      Adapters.Emotions.EntrySnapshot,
      SupportedLanguages.en,
    ).create(mocks.inactivityDetection);

    expect(result).toEqual(new AI.Prompt(`Inactive for ${mocks.inactivityTrigger.inactivityDays} days`));
  });
});
