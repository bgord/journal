import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as mocks from "./mocks";

describe("WeeklyReviewExportNotificationComposer", () => {
  test("compose - en", () => {
    const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();
    const notification = composer.compose(mocks.week, SupportedLanguages.en);

    expect(notification).toEqual({
      subject: `JOURNAL - weekly review ${mocks.weekStart} - ${mocks.weekEnd}`,
      html: "Find the file attached",
    });
  });

  test("compose - pl", () => {
    const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();
    const notification = composer.compose(mocks.week, SupportedLanguages.pl);

    expect(notification).toEqual({
      subject: `JOURNAL - przegląd tygodnia ${mocks.weekStart} - ${mocks.weekEnd}`,
      html: "Plik w załączniku",
    });
  });
});
