import { describe, expect, it, jest, spyOn } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onAlarmGeneratedEvent", () => {
  it("should call repository generated method with the event", async () => {
    const generate = spyOn(Emotions.Repos.AlarmRepository, "generate").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onAlarmGeneratedEvent(mocks.GenericAlarmGeneratedEvent);

    expect(generate).toHaveBeenCalledTimes(1);
    expect(generate).toHaveBeenCalledWith(mocks.GenericAlarmGeneratedEvent);

    jest.restoreAllMocks();
  });
});
