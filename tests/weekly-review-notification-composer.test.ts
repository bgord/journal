import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewNotificationComposer", () => {
  test("compose", () => {
    const composer = new Emotions.Services.WeeklyReviewNotificationComposer();
    const weekStart = new Emotions.VO.WeekStart(mocks.weekStartedAt);

    const notification = composer.compose(weekStart, [], mocks.advice);

    expect(notification).toEqual(
      new Emotions.VO.NotificationTemplate(
        `Weekly Review - ${weekStart.get()}`,
        `Weekly review: ${weekStart.get()}`,
      ),
    );
  });
});
