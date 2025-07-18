import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewNotificationComposer", () => {
  test("compose", () => {
    const composer = new Emotions.Services.WeeklyReviewNotificationComposer();
    const weekStart = new Emotions.VO.WeekStart(mocks.weekStartedAt);

    const notification = composer.compose(weekStart, [], new Emotions.VO.EmotionalAdvice("Good job"));

    expect(notification).toEqual({
      subject: `Weekly Review - ${weekStart.get()}`,
      content: `Weekly review: ${weekStart.get()}`,
    });
  });
});
