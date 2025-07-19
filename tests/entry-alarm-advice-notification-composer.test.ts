import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("EntryAlarmAdviceNotificationComposer", () => {
  test("compose", () => {
    const entryAlarmAdviceNotificationComposer = new Emotions.Services.EntryAlarmAdviceNotificationComposer(
      mocks.partialEntry,
    );

    const notification = entryAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual(
      new Emotions.VO.NotificationTemplate(
        "Emotional advice",
        `Advice for emotion entry: ${mocks.partialEntry.emotionLabel}: ${mocks.advice.get()}`,
      ),
    );
  });
});
