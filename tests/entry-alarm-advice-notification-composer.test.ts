import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("EmotionalAdviceNotificationComposer", () => {
  test("compose", () => {
    const advice = new Emotions.VO.Advice("Do something");

    const emotionalAdviceNotificationComposer = new Emotions.Services.EntryAlarmAdviceNotificationComposer(
      mocks.partialEntry,
    );

    const notification = emotionalAdviceNotificationComposer.compose(advice);

    expect(notification).toEqual({
      subject: "Emotional advice",
      content: `Advice for emotion entry: ${mocks.partialEntry.emotionLabel}: ${advice}`,
    });
  });
});
