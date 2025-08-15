import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import * as mocks from "./mocks";

describe("WeeklyReviewSkippedNotificationComposer", () => {
  test("compose", () => {
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();

    const notification = composer.compose(mocks.week);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        "Weekly Review - come back and journal",
        `Week you missed ${mocks.week.getStart()}`,
      ),
    );
  });
});
