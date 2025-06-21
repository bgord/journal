import { describe, expect, jest, spyOn, test } from "bun:test";
import { onEmotionLoggedEvent } from "../modules/emotions/handlers/onEmotionLoggedEvent";
import { EmotionJournalEntryRepository } from "../modules/emotions/repositories/";
import { GenericEmotionLoggedEvent } from "./mocks";

describe("onEmotionLoggedEvent", () => {
  test("should call repository logEmotion method with the event", async () => {
    const logEmotion = spyOn(EmotionJournalEntryRepository, "logEmotion").mockImplementation(jest.fn());

    await onEmotionLoggedEvent(GenericEmotionLoggedEvent);

    expect(logEmotion).toHaveBeenCalledTimes(1);
    expect(logEmotion).toHaveBeenCalledWith(GenericEmotionLoggedEvent);

    logEmotion.mockRestore();
  });
});
