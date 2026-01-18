import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";

describe("TimeCapsuleEntryNotificationComposer", () => {
  test("compose - en", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.TimeCapsuleEntryNotificationComposer(
      SupportedLanguages.en,
    );

    expect(entryAlarmAdviceNotificationComposer.compose()).toEqual({
      subject: bg.MailerSubject.parse("JOURNAL - time capsule entry"),
      html: bg.MailerContentHtml.parse("Go to the homepage"),
    });
  });

  test("compose - pl", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.TimeCapsuleEntryNotificationComposer(
      SupportedLanguages.pl,
    );

    expect(entryAlarmAdviceNotificationComposer.compose()).toEqual({
      subject: bg.MailerSubject.parse("JOURNAL - wpis z przeszłości"),
      html: bg.MailerContentHtml.parse("Odwiedź stronę główną"),
    });
  });
});
