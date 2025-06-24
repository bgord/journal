import { describe, expect, test } from "bun:test";

import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("EmotionalAdviceNotificationComposer", () => {
  test("compose", () => {
    const negativeEmotionExtremeIntensityEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
      mocks.GenericSituationLoggedEvent,
      mocks.NegativeEmotionExtremeIntensityLoggedEvent,
    ]);

    const advice = new Emotions.VO.EmotionalAdvice("Do something");

    const emotionalAdviceNotificationComposer = new Emotions.Services.EmotionalAdviceNotificationComposer(
      negativeEmotionExtremeIntensityEntry.summarize(),
    );

    const notification = emotionalAdviceNotificationComposer.compose(advice);

    expect(notification).toEqual(
      `Advice for emotion entry: ${negativeEmotionExtremeIntensityEntry.summarize().emotion?.label}: ${advice.get()}`,
    );
  });
});
