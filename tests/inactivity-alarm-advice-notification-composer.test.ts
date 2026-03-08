import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { languages } from "+languages";
import * as mocks from "./mocks";

describe("InactivityAlarmAdviceNotificationComposer", () => {
  test("compose - en", () => {
    const inactivityAlarmAdviceNotificationComposer =
      new Emotions.Services.InactivityAlarmAdviceNotificationComposer(
        mocks.inactivityTrigger,
        languages.supported.en,
      );
    const notification = inactivityAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual({
      subject: bg.MailerSubject.parse("JOURNAL - inactivity advice"),
      html: bg.MailerContentHtml.parse(
        `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
      ),
    });
  });

  test("compose - pl", () => {
    const inactivityAlarmAdviceNotificationComposer =
      new Emotions.Services.InactivityAlarmAdviceNotificationComposer(
        mocks.inactivityTrigger,
        languages.supported.pl,
      );
    const notification = inactivityAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual({
      subject: bg.MailerSubject.parse("JOURNAL - porada dla braku aktywności"),
      html: bg.MailerContentHtml.parse(
        `Brak aktywności przez ${mocks.inactivityTrigger.inactivityDays} dni, porada: ${mocks.advice.get()}`,
      ),
    });
  });
});
