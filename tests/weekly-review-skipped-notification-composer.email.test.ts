import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Emotions from "+emotions";
import { languages } from "+languages";
import * as mocks from "./mocks";

describe("WeeklyReviewSkippedNotificationComposer", () => {
  test("compose - en", () => {
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();
    const notification = composer.compose(mocks.week, languages.supported.en);

    expect(notification).toEqual({
      subject: v.parse(bg.MailerSubject, `JOURNAL - weekly review ${mocks.weekStart} - ${mocks.weekEnd}`),
      html: v.parse(bg.MailerContentHtml, "Come back and journal"),
    });
  });

  test("compose - pl", () => {
    const composer = new Emotions.Services.WeeklyReviewSkippedNotificationComposer();
    const notification = composer.compose(mocks.week, languages.supported.pl);

    expect(notification).toEqual({
      subject: v.parse(bg.MailerSubject, `JOURNAL - przegląd tygodnia ${mocks.weekStart} - ${mocks.weekEnd}`),
      html: v.parse(bg.MailerContentHtml, "Wróć do nas"),
    });
  });
});
