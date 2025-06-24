import { describe, expect, jest, spyOn, test } from "bun:test";
import { EventStore } from "../infra/event-store";
import { onEmotionLoggedEvent } from "../modules/emotions/handlers/onEmotionLoggedEvent";
import { EmotionJournalEntryRepository } from "../modules/emotions/repositories";
import * as mocks from "./mocks";

describe("onEmotionLoggedEvent", () => {
  test("should call repository logEmotion method with the event", async () => {
    const eventStoreSave = spyOn(EventStore, "save").mockImplementation(jest.fn());

    const logEmotion = spyOn(EmotionJournalEntryRepository, "logEmotion").mockImplementation(jest.fn());

    await onEmotionLoggedEvent(mocks.NegativeEmotionExtremeIntensityLoggedEvent);

    expect(logEmotion).toHaveBeenCalledTimes(1);
    expect(logEmotion).toHaveBeenCalledWith(mocks.NegativeEmotionExtremeIntensityLoggedEvent);

    expect(eventStoreSave).toHaveBeenCalledWith([mocks.GenericAlarmGeneratedEvent]);

    jest.restoreAllMocks();
  });
});
