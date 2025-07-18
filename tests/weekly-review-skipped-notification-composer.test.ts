import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewSkippedNotificationComposer", () => {
  test("compose", () => {
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();
    const weekStart = new Emotions.VO.WeekStart(mocks.weekStartedAt);

    const notification = composer.compose(weekStart);

    expect(notification).toEqual({
      subject: "Weekly Review - come back and journal",
      content: `Week you missed ${weekStart.get()}`,
    });
  });
});
