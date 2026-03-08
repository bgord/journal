import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { languages } from "+languages";

describe("TimeCapsuleEntryNotificationComposer", () => {
  test("compose - en", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.TimeCapsuleEntryNotificationComposer(
      languages.supported.en,
    );

    expect(entryAlarmAdviceNotificationComposer.compose()).toEqual({
      subject: bg.MailerSubject.parse("JOURNAL - time capsule entry"),
      html: bg.MailerContentHtml.parse("Go to the homepage"),
    });
  });

  test("compose - pl", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.TimeCapsuleEntryNotificationComposer(
      languages.supported.pl,
    );

    expect(entryAlarmAdviceNotificationComposer.compose()).toEqual({
      subject: bg.MailerSubject.parse("JOURNAL - wpis z przeszłości"),
      html: bg.MailerContentHtml.parse("Odwiedź stronę główną"),
    });
  });
});
