import { describe, expect, test } from "bun:test";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import * as mocks from "./mocks";

describe("InactivityAlarmAdviceNotificationComposer", () => {
  test("compose", () => {
    const inactivityAlarmAdviceNotificationComposer =
      new Emotions.Services.InactivityAlarmAdviceNotificationComposer(mocks.inactivityTrigger);
    const notification = inactivityAlarmAdviceNotificationComposer.compose(mocks.advice);

    expect(notification).toEqual(
      new tools.NotificationTemplate(
        "Inactivity advice",
        `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${mocks.advice.get()}`,
      ),
    );
  });
});
