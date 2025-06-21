import { describe, it, expect, beforeEach, mock } from "bun:test";
import * as Emotions from "../modules/emotions";
import { onReactionLoggedEvent } from "../modules/emotions/handlers/onReactionLoggedEvent";
import { GenericReactionLoggedEvent } from "./mocks";

// Mock the repository
const mockLogReaction = mock(() => Promise.resolve());

mock.module("../modules/emotions/repositories", () => ({
  EmotionJournalEntryRepository: {
    logReaction: mockLogReaction,
  },
}));

describe("onReactionLoggedEvent", () => {
  beforeEach(() => {
    mockLogReaction.mockClear();
  });

  it("should call repository logReaction method with the event", async () => {
    await onReactionLoggedEvent(GenericReactionLoggedEvent);

    expect(mockLogReaction).toHaveBeenCalledTimes(1);
    expect(mockLogReaction).toHaveBeenCalledWith(GenericReactionLoggedEvent);
  });

  it("should handle reaction logged event with valid payload", async () => {
    const event = {
      id: "test-event-id",
      createdAt: 1234567890,
      name: Emotions.Events.REACTION_LOGGED_EVENT,
      stream: "test-stream",
      version: 1,
      payload: {
        id: "test-entry-id",
        description: "Went for a walk",
        type: Emotions.VO.GrossEmotionRegulationStrategy.reappraisal,
        effectiveness: 4,
      },
    } as Emotions.Events.ReactionLoggedEventType;

    await onReactionLoggedEvent(event);

    expect(mockLogReaction).toHaveBeenCalledWith(event);
  });
}); 