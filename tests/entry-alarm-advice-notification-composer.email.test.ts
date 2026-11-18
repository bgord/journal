import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as v from "valibot";
import * as Emotions from "+emotions";
import { languages } from "+languages";
import * as mocks from "./mocks";

describe("EntryAlarmAdviceNotificationComposer", () => {
  test("compose - en", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.EntryAlarmAdviceNotificationComposer(
      mocks.partialEntry,
      languages.supported.en,
    );
    const notification = entryAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual({
      subject: v.parse(bg.MailerSubject, "JOURNAL - emotional advice"),
      html: v.parse(
        bg.MailerContentHtml,
        `Advice for emotion entry: ${mocks.partialEntry.emotionLabel}: ${mocks.advice.get()}`,
      ),
    });
  });

  test("compose - pl", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.EntryAlarmAdviceNotificationComposer(
      mocks.partialEntry,
      languages.supported.pl,
    );
    const notification = entryAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual({
      subject: v.parse(bg.MailerSubject, "JOURNAL - porada emocjonalna"),
      html: v.parse(
        bg.MailerContentHtml,
        `Porada dla emocji: ${mocks.partialEntry.emotionLabel}: ${mocks.advice.get()}`,
      ),
    });
  });
});
