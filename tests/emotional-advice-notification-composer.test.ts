import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("EmotionalAdviceNotificationComposer", () => {
  test("compose", () => {
    const advice = "Do something";

    const emotionalAdviceNotificationComposer = new Emotions.Services.EmotionalAdviceNotificationComposer(
      mocks.partialEntry,
    );

    const notification = emotionalAdviceNotificationComposer.compose(advice);

    expect(notification).toEqual(
      `Advice for emotion entry: ${mocks.partialEntry.emotionLabel}: ${advice}`,
    );
  });
});
