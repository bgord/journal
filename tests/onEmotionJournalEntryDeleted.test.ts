import { describe, expect, jest, spyOn, test } from "bun:test";
import { onEmotionJournalEntryDeletedEvent } from "../modules/emotions/handlers/onEmotionJournalEntryDeleted";
import { EmotionJournalEntryRepository } from "../modules/emotions/repositories/";
import { GenericEmotionJournalEntryDeletedEvent } from "./mocks";

describe("onEmotionJournalEntryDeletedEvent", () => {
  test("should call repository deleteEntry method with the event", async () => {
    const deleteEntry = spyOn(EmotionJournalEntryRepository, "deleteEntry").mockImplementation(jest.fn());

    await onEmotionJournalEntryDeletedEvent(GenericEmotionJournalEntryDeletedEvent);

    expect(deleteEntry).toHaveBeenCalledTimes(1);
    expect(deleteEntry).toHaveBeenCalledWith(GenericEmotionJournalEntryDeletedEvent);

    deleteEntry.mockRestore();
  });
});
