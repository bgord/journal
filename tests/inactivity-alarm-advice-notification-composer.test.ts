import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("InactivityAlarmAdviceNotificationComposer", () => {
  test("compose", () => {
    const advice = new Emotions.VO.Advice("Do something");

    const inactivityAlarmAdviceNotificationComposer =
      new Emotions.Services.InactivityAlarmAdviceNotificationComposer(mocks.inactivityTrigger);

    const notification = inactivityAlarmAdviceNotificationComposer.compose(advice);

    expect(notification).toEqual({
      subject: "Inactivity advice",
      content: `Inactive for ${mocks.inactivityTrigger.inactivityDays} days, advice: ${advice.get()}`,
    });
  });
});
