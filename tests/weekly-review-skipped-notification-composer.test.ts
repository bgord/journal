import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as mocks from "./mocks";

describe("WeeklyReviewSkippedNotificationComposer", () => {
  test("compose - en", () => {
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();
    const notification = composer.compose(mocks.week, SupportedLanguages.en);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        "Weekly Review - come back and journal",
        `Week you missed ${mocks.week.getStart()}`,
      ),
    );
  });

  test("compose - pl", () => {
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();
    const notification = composer.compose(mocks.week, SupportedLanguages.pl);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        "Przegląd tygodnia - wróć do nas",
        `Przegapiony tydzień ${mocks.week.getStart()}`,
      ),
    );
  });
});
