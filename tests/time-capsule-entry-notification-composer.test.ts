import { describe, expect, test } from "bun:test";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";

describe("TimeCapsuleEntryNotificationComposer", () => {
  test("compose - en", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.TimeCapsuleEntryNotificationComposer(
      SupportedLanguages.en,
    );

    expect(entryAlarmAdviceNotificationComposer.compose()).toEqual({
      subject: "JOURNAL - time capsule entry",
      html: "Go to the homepage",
    });
  });

  test("compose - pl", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.TimeCapsuleEntryNotificationComposer(
      SupportedLanguages.pl,
    );

    expect(entryAlarmAdviceNotificationComposer.compose()).toEqual({
      subject: "JOURNAL - wpis z przeszłości",
      html: "Odwiedź stronę główną",
    });
  });
});
