import { describe, expect, it, jest, spyOn } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onAlarmCancelledEvent", () => {
  it("should call repository updateStatus method with the event", async () => {
    const updateStatus = spyOn(Emotions.Repos.AlarmRepository, "cancel").mockImplementation(jest.fn());

    await Emotions.Handlers.onAlarmCancelledEvent(mocks.GenericAlarmCancelledEvent);

    expect(updateStatus).toHaveBeenCalledTimes(1);
    expect(updateStatus).toHaveBeenCalledWith(mocks.GenericAlarmCancelledEvent);

    jest.restoreAllMocks();
  });
});
