import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewExportNotificationComposer", () => {
  test("compose", () => {
    const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();

    const notification = composer.compose(mocks.weeklyReview);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        `Weekly Review PDF - ${mocks.week.getStart()}`,
        "Find the file attached",
      ),
    );
  });
});
