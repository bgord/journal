import { beforeEach, describe, expect, it, mock } from "bun:test";
import * as Emotions from "../modules/emotions";
import { onEmotionJournalEntryDeletedEvent } from "../modules/emotions/handlers/onEmotionJournalEntryDeleted";
import { GenericEmotionJournalEntryDeletedEvent } from "./mocks";

// Mock the repository
const mockDeleteEntry = mock(() => Promise.resolve());

mock.module("../modules/emotions/repositories", () => ({
  EmotionJournalEntryRepository: {
    deleteEntry: mockDeleteEntry,
  },
}));

describe("onEmotionJournalEntryDeletedEvent", () => {
  beforeEach(() => {
    mockDeleteEntry.mockClear();
  });

  it("should call repository deleteEntry method with the event", async () => {
    await onEmotionJournalEntryDeletedEvent(GenericEmotionJournalEntryDeletedEvent);

    expect(mockDeleteEntry).toHaveBeenCalledTimes(1);
    expect(mockDeleteEntry).toHaveBeenCalledWith(GenericEmotionJournalEntryDeletedEvent);
  });

  it("should handle emotion journal entry deleted event with valid payload", async () => {
    const event = {
      id: "test-event-id",
      createdAt: 1234567890,
      name: Emotions.Events.EMOTION_JOURNAL_ENTRY_DELETED,
      stream: "test-stream",
      version: 1,
      payload: {
        id: "test-entry-id",
      },
    } as Emotions.Events.EmotionJournalEntryDeletedEventType;

    await onEmotionJournalEntryDeletedEvent(event);

    expect(mockDeleteEntry).toHaveBeenCalledWith(event);
  });
});
