import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";

describe("TimeCapsuleEntryNotificationComposer", () => {
  test("compose - en", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.TimeCapsuleEntryNotificationComposer(
      SupportedLanguages.en,
    );

    expect(entryAlarmAdviceNotificationComposer.compose()).toEqual(
      new tools.NotificationTemplate("Time capsule entry", "Go to the homepage"),
    );
  });

  test("compose - pl", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.TimeCapsuleEntryNotificationComposer(
      SupportedLanguages.pl,
    );

    expect(entryAlarmAdviceNotificationComposer.compose()).toEqual(
      new tools.NotificationTemplate("Wpis z przeszłości", "Odwiedź stronę główną"),
    );
  });
});
