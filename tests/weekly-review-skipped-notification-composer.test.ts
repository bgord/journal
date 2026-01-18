import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as mocks from "./mocks";

describe("WeeklyReviewSkippedNotificationComposer", () => {
  test("compose - en", () => {
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();
    const notification = composer.compose(mocks.week, SupportedLanguages.en);

    expect(notification).toEqual({
      subject: bg.MailerSubject.parse(`JOURNAL - weekly review ${mocks.weekStart} - ${mocks.weekEnd}`),
      html: bg.MailerContentHtml.parse("Come back and journal"),
    });
  });

  test("compose - pl", () => {
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();
    const notification = composer.compose(mocks.week, SupportedLanguages.pl);

    expect(notification).toEqual({
      subject: bg.MailerSubject.parse(`JOURNAL - przegląd tygodnia ${mocks.weekStart} - ${mocks.weekEnd}`),
      html: bg.MailerContentHtml.parse("Wróć do nas"),
    });
  });
});
