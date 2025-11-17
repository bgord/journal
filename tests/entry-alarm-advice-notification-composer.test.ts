import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { SupportedLanguages } from "+languages";
import * as mocks from "./mocks";

describe("EntryAlarmAdviceNotificationComposer", () => {
  test("compose - en", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.EntryAlarmAdviceNotificationComposer(
      mocks.partialEntry,
      SupportedLanguages.en,
    );
    const notification = entryAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        "JOURNAL - emotional advice",
        `Advice for emotion entry: ${mocks.partialEntry.emotionLabel}: ${mocks.advice.get()}`,
      ),
    );
  });

  test("compose - pl", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.EntryAlarmAdviceNotificationComposer(
      mocks.partialEntry,
      SupportedLanguages.pl,
    );
    const notification = entryAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        "JOURNAL - porada emocjonalna",
        `Porada dla emocji: ${mocks.partialEntry.emotionLabel}: ${mocks.advice.get()}`,
      ),
    );
  });
});
