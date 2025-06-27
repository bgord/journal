import { describe, expect, it, jest, spyOn } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe.skip("onAlarmAdviceSavedEvent", () => {
  it("should call repository saveAdvice method with the event", async () => {
    const saveAdvice = spyOn(Emotions.Repos.AlarmRepository, "saveAdvice").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onAlarmAdviceSavedEvent(mocks.GenericAlarmAdviceSavedEvent);

    expect(saveAdvice).toHaveBeenCalledTimes(1);
    expect(saveAdvice).toHaveBeenCalledWith(mocks.GenericAlarmAdviceSavedEvent);

    jest.restoreAllMocks();
  });
});
