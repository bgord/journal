import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("EmotionalAdvicePrompt", () => {
  test("situation + emotion", () => {
    const negativeEmotionExtremeIntensityEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
      mocks.GenericSituationLoggedEvent,
      mocks.NegativeEmotionExtremeIntensityLoggedEvent,
    ]);

    const prompt = new Emotions.Services.EmotionalAdvicePrompt(
      negativeEmotionExtremeIntensityEntry.summarize(),
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
    );

    expect(prompt.generate()).toEqual([
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      {
        role: "user",
        content:
          "Here is a summary of a journal entry from my AI journal app, it triggered an NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM alarm. Situation (achievement): I finished a project, at work. Emotion: anger, intensity 5/5. As a compassionate mental health coach, please suggest two brief coping strategies for this situation.",
      },
    ]);
  });

  test("situation + emotion + reaction", () => {
    const negativeEmotionExtremeIntensityEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
      mocks.GenericSituationLoggedEvent,
      mocks.NegativeEmotionExtremeIntensityLoggedEvent,
      mocks.MaladaptiveReactionLoggedEvent,
    ]);

    const prompt = new Emotions.Services.EmotionalAdvicePrompt(
      negativeEmotionExtremeIntensityEntry.summarize(),
      Emotions.VO.AlarmNameOption.NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM,
    );

    expect(prompt.generate()).toEqual([
      {
        role: "system",
        content: "You are a compassionate mental health coach providing short, practical advice.",
      },
      {
        role: "user",
        content:
          "Here is a summary of a journal entry from my AI journal app, it triggered an NEGATIVE_EMOTION_EXTREME_INTENSITY_ALARM alarm. Situation (achievement): I finished a project, at work. Emotion: anger, intensity 5/5. Reaction (avoidance): Got drunk, intensity 1/5. As a compassionate mental health coach, please suggest two brief coping strategies for this situation.",
      },
    ]);
  });
});
