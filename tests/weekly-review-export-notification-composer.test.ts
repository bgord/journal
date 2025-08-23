import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as mocks from "./mocks";

describe("WeeklyReviewExportNotificationComposer", () => {
  test("compose - en", () => {
    const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();
    const notification = composer.compose(mocks.weeklyReviewFull, SupportedLanguages.en);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        `Weekly Review PDF - ${mocks.week.getStart()}`,
        "Find the file attached",
      ),
    );
  });

  test.todo("compose - pl");
});
