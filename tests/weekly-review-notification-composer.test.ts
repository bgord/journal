import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewNotificationComposer", () => {
  test("compose", () => {
    const composer = new Emotions.Services.WeeklyReviewNotificationComposer();
    const weekStart = new Emotions.VO.WeekStart(mocks.weekStartedAt);

    const notification = composer.compose(weekStart, [], new Emotions.VO.Advice("Good job"));

    expect(notification).toEqual(
      new Emotions.Services.NotificationTemplate(
        `Weekly Review - ${weekStart.get()}`,
        `Weekly review: ${weekStart.get()}`,
      ),
    );
  });
});
