import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onAlarmNotificationSentEvent", () => {
  test("should call repository notify method with the event", async () => {
    const notify = spyOn(Emotions.Repos.AlarmRepository, "notify").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onAlarmNotificationSentEvent(mocks.GenericAlarmNotificationSentEvent);

    expect(notify).toHaveBeenCalledTimes(1);
    expect(notify).toHaveBeenCalledWith(mocks.GenericAlarmNotificationSentEvent);
  });
});
