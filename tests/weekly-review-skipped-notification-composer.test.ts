import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewSkippedNotificationComposer", () => {
  test("compose", () => {
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();
    const weekStart = new Emotions.VO.WeekStart(mocks.weekStartedAt);

    const notification = composer.compose(weekStart);

    expect(notification).toEqual(
      new Emotions.VO.NotificationTemplate(
        "Weekly Review - come back and journal",
        `Week you missed ${weekStart.get()}`,
      ),
    );
  });
});
