import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Emotions from "+emotions";
import { languages } from "+languages";

describe("TimeCapsuleEntryNotificationComposer", () => {
  test("compose - en", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.TimeCapsuleEntryNotificationComposer(
      languages.supported.en,
    );

    expect(entryAlarmAdviceNotificationComposer.compose()).toEqual({
      subject: v.parse(bg.MailerSubject, "JOURNAL - time capsule entry"),
      html: v.parse(bg.MailerContentHtml, "Go to the homepage"),
    });
  });

  test("compose - pl", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.TimeCapsuleEntryNotificationComposer(
      languages.supported.pl,
    );

    expect(entryAlarmAdviceNotificationComposer.compose()).toEqual({
      subject: v.parse(bg.MailerSubject, "JOURNAL - wpis z przeszłości"),
      html: v.parse(bg.MailerContentHtml, "Odwiedź stronę główną"),
    });
  });
});
