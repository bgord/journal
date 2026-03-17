import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as v from "valibot";
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
      subject: v.parse(bg.MailerSubject, "JOURNAL - inactivity advice"),
      html: v.parse(
        bg.MailerContentHtml,
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
      subject: v.parse(bg.MailerSubject, "JOURNAL - porada dla braku aktywności"),
      html: v.parse(
        bg.MailerContentHtml,
        `Brak aktywności przez ${mocks.inactivityTrigger.inactivityDays} dni, porada: ${mocks.advice.get()}`,
      ),
    });
  });
});
