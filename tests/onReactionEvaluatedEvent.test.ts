import { describe, it, expect, beforeEach, mock } from "bun:test";
import * as Emotions from "../modules/emotions";
import { onReactionEvaluatedEvent } from "../modules/emotions/handlers/onReactionEvaluatedEvent";
import { GenericReactionEvaluatedEvent } from "./mocks";

// Mock the repository
const mockEvaluateReaction = mock(() => Promise.resolve());

mock.module("../modules/emotions/repositories", () => ({
  EmotionJournalEntryRepository: {
    evaluateReaction: mockEvaluateReaction,
  },
}));

describe("onReactionEvaluatedEvent", () => {
  beforeEach(() => {
    mockEvaluateReaction.mockClear();
  });

  it("should call repository evaluateReaction method with the event", async () => {
    await onReactionEvaluatedEvent(GenericReactionEvaluatedEvent);

    expect(mockEvaluateReaction).toHaveBeenCalledTimes(1);
    expect(mockEvaluateReaction).toHaveBeenCalledWith(GenericReactionEvaluatedEvent);
  });

  it("should handle reaction evaluated event with valid payload", async () => {
    const event = {
      id: "test-event-id",
      createdAt: 1234567890,
      name: Emotions.Events.REACTION_EVALUATED_EVENT,
      stream: "test-stream",
      version: 1,
      payload: {
        id: "test-entry-id",
        description: "Went for a walk",
        type: Emotions.VO.GrossEmotionRegulationStrategy.reappraisal,
        effectiveness: 4,
      },
    } as Emotions.Events.ReactionEvaluatedEventType;

    await onReactionEvaluatedEvent(event);

    expect(mockEvaluateReaction).toHaveBeenCalledWith(event);
  });
}); 