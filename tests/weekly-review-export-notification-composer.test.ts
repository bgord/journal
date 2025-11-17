import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as mocks from "./mocks";

describe("WeeklyReviewExportNotificationComposer", () => {
  test("compose - en", () => {
    const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();
    const notification = composer.compose(mocks.week, SupportedLanguages.en);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        `JOURNAL - weekly review ${mocks.weekStart} - ${mocks.weekEnd}`,
        "Find the file attached",
      ),
    );
  });

  test("compose - pl", () => {
    const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();
    const notification = composer.compose(mocks.week, SupportedLanguages.pl);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        `JOURNAL - przegląd tygodnia ${mocks.weekStart} - ${mocks.weekEnd}`,
        "Plik w załączniku",
      ),
    );
  });
});
