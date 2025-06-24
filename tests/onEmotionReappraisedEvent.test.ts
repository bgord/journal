import { describe, expect, jest, spyOn, test } from "bun:test";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onEmotionReappraisedEvent", () => {
  test("should call repository reappraiseEmotion method with the event", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const reappraiseEmotion = spyOn(
      Emotions.Repos.EmotionJournalEntryRepository,
      "reappraiseEmotion",
    ).mockImplementation(jest.fn());

    await Emotions.Handlers.onEmotionReappraisedEvent(mocks.NegativeEmotionExtremeIntensityReappraisedEvent);

    expect(reappraiseEmotion).toHaveBeenCalledTimes(1);
    expect(reappraiseEmotion).toHaveBeenCalledWith(mocks.NegativeEmotionExtremeIntensityReappraisedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });
});
