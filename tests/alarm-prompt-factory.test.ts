import { describe, expect, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("AlarmPromptFactory", () => {
  test("entry", async () => {
    spyOn(Emotions.Repos.EntryRepository, "getByIdRaw").mockResolvedValue(mocks.partialEntry);

    const result = await Emotions.Services.AlarmPromptFactory.create(mocks.entryDetection);
    expect(result).toEqual(
      new Emotions.VO.Prompt(
        "Here is a summary of an entry from my AI journal app, it triggered an NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM alarm. Situation (achievement): I finished a project, at work. Emotion: anger, intensity 5/5. As a compassionate mental health coach, please suggest two brief coping strategies for this situation.",
      ),
    );
  });

  test("inactivity", async () => {
    const result = await Emotions.Services.AlarmPromptFactory.create(mocks.inactivityDetection);
    expect(result).toEqual(
      new Emotions.VO.Prompt(`Inactive for ${mocks.inactivityTrigger.inactivityDays} days`),
    );
  });
});
