import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { languages } from "+languages";
import * as mocks from "./mocks";

describe("WeeklyReviewExportNotificationComposer", () => {
  test("compose - en", () => {
    const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();
    const notification = composer.compose(mocks.week, languages.supported.en);

    expect(notification).toEqual({
      subject: bg.MailerSubject.parse(`JOURNAL - weekly review ${mocks.weekStart} - ${mocks.weekEnd}`),
      html: bg.MailerContentHtml.parse("Find the file attached"),
    });
  });

  test("compose - pl", () => {
    const composer = new Emotions.Services.WeeklyReviewExportNotificationComposer();
    const notification = composer.compose(mocks.week, languages.supported.pl);

    expect(notification).toEqual({
      subject: bg.MailerSubject.parse(`JOURNAL - przegląd tygodnia ${mocks.weekStart} - ${mocks.weekEnd}`),
      html: bg.MailerContentHtml.parse("Plik w załączniku"),
    });
  });
});
