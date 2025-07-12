import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onEmotionLoggedEvent", () => {
  test("should call repository logEmotion method with the event", async () => {
    const logEmotion = spyOn(Emotions.Repos.EntryRepository, "logEmotion").mockImplementation(jest.fn());

    await Emotions.EventHandlers.onEmotionLoggedEvent(mocks.NegativeEmotionExtremeIntensityLoggedEvent);

    expect(logEmotion).toHaveBeenCalledTimes(1);
    expect(logEmotion).toHaveBeenCalledWith(mocks.NegativeEmotionExtremeIntensityLoggedEvent);

    jest.restoreAllMocks();
  });
});
