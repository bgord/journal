import * as Emotions from "+emotions";
import { describe, expect, test } from "bun:test";
import * as mocks from "./mocks";

describe("WeeklyReviewExportNotificationComposer", () => {
  test("compose", () => {
    const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();

    const notification = composer.compose(mocks.weeklyReview);

    expect(notification).toEqual(
      new Emotions.VO.NotificationTemplate(
        `Weekly Review PDF - ${mocks.week.getStart()}`,
        "Find the file attached",
      ),
    );
  });
});
