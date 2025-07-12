import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onEmotionReappraisedEvent", () => {
  test("should call repository reappraiseEmotion method with the event", async () => {
    const reappraiseEmotion = spyOn(Emotions.Repos.EntryRepository, "reappraiseEmotion").mockImplementation(
      jest.fn(),
    );

    await Emotions.EventHandlers.onEmotionReappraisedEvent(
      mocks.NegativeEmotionExtremeIntensityReappraisedEvent,
    );

    expect(reappraiseEmotion).toHaveBeenCalledTimes(1);
    expect(reappraiseEmotion).toHaveBeenCalledWith(mocks.NegativeEmotionExtremeIntensityReappraisedEvent);

    jest.restoreAllMocks();
  });
});
