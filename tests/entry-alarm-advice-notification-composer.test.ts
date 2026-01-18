import { describe, expect, test } from "bun:test";
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

    expect(notification).toEqual({
      subject: "JOURNAL - emotional advice",
      html: `Advice for emotion entry: ${mocks.partialEntry.emotionLabel}: ${mocks.advice.get()}`,
    });
  });

  test("compose - pl", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.EntryAlarmAdviceNotificationComposer(
      mocks.partialEntry,
      SupportedLanguages.pl,
    );
    const notification = entryAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual({
      subject: "JOURNAL - porada emocjonalna",
      html: `Porada dla emocji: ${mocks.partialEntry.emotionLabel}: ${mocks.advice.get()}`,
    });
  });
});
