import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as mocks from "./mocks";

describe("InactivityAlarmAdviceNotificationComposer", () => {
  test("compose - en", () => {
    const inactivityAlarmAdviceNotificationComposer =
      new Emotions.Services.InactivityAlarmAdviceNotificationComposer(
        mocks.inactivityTrigger,
        SupportedLanguages.en,
      );

    const notification = inactivityAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        "JOURNAL - inactivity advice",
        `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
      ),
    );
  });

  test("compose - pl", () => {
    const inactivityAlarmAdviceNotificationComposer =
      new Emotions.Services.InactivityAlarmAdviceNotificationComposer(
        mocks.inactivityTrigger,
        SupportedLanguages.pl,
      );

    const notification = inactivityAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        "JOURNAL - porada dla braku aktywności",
        `Brak aktywności przez ${mocks.inactivityTrigger.inactivityDays} dni, porada: ${mocks.advice.get()}`,
      ),
    );
  });
});
