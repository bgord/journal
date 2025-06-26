import { describe, expect, jest, spyOn, test } from "bun:test";
import { EventStore } from "../infra/event-store";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("onEmotionLoggedEvent", () => {
  test("should call repository logEmotion method with the event", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const logEmotion = spyOn(Emotions.Repos.EmotionJournalEntryRepository, "logEmotion").mockImplementation(
      jest.fn(),
    );

    await Emotions.Handlers.onEmotionLoggedEvent(mocks.NegativeEmotionExtremeIntensityLoggedEvent);

    expect(logEmotion).toHaveBeenCalledTimes(1);
    expect(logEmotion).toHaveBeenCalledWith(mocks.NegativeEmotionExtremeIntensityLoggedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });

  test("respects DailyAlarmLimit policy", async () => {
    spyOn(Emotions.Repos.AlarmRepository, "getCreatedTodayCount").mockResolvedValue(5);
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const logEmotion = spyOn(Emotions.Repos.EmotionJournalEntryRepository, "logEmotion").mockImplementation(
      jest.fn(),
    );

    expect(async () =>
      Emotions.Handlers.onEmotionLoggedEvent(mocks.NegativeEmotionExtremeIntensityLoggedEvent),
    ).toThrow(Emotions.Policies.DailyAlarmLimit.error);

    expect(logEmotion).toHaveBeenCalledTimes(1);
    expect(logEmotion).toHaveBeenCalledWith(mocks.NegativeEmotionExtremeIntensityLoggedEvent);

    expect(eventStoreSave).not.toHaveBeenCalled();

    jest.restoreAllMocks();
  });
});
