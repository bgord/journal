import { describe, expect, jest, spyOn, test } from "bun:test";
import { onReactionLoggedEvent } from "../modules/emotions/handlers/onReactionLoggedEvent";
import { EmotionJournalEntryRepository } from "../modules/emotions/repositories/";
import { GenericReactionLoggedEvent } from "./mocks";

describe("onReactionLoggedEvent", () => {
  test("should call repository logReaction method with the event", async () => {
    const logReaction = spyOn(EmotionJournalEntryRepository, "logReaction").mockImplementation(jest.fn());

    await onReactionLoggedEvent(GenericReactionLoggedEvent);

    expect(logReaction).toHaveBeenCalledTimes(1);
    expect(logReaction).toHaveBeenCalledWith(GenericReactionLoggedEvent);

    logReaction.mockRestore();
  });
});
