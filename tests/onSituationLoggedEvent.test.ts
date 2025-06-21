import { describe, it, expect, beforeEach, mock } from "bun:test";
import * as Emotions from "../modules/emotions";
import { onSituationLoggedEvent } from "../modules/emotions/handlers/onSituationLoggedEvent";
import { GenericSituationLoggedEvent } from "./mocks";

// Mock the repository
const mockLogSituation = mock(() => Promise.resolve());

mock.module("../modules/emotions/repositories", () => ({
  EmotionJournalEntryRepository: {
    logSituation: mockLogSituation,
  },
}));

describe("onSituationLoggedEvent", () => {
  beforeEach(() => {
    mockLogSituation.mockClear();
  });

  it("should call repository logSituation method with the event", async () => {
    await onSituationLoggedEvent(GenericSituationLoggedEvent);

    expect(mockLogSituation).toHaveBeenCalledTimes(1);
    expect(mockLogSituation).toHaveBeenCalledWith(GenericSituationLoggedEvent);
  });

  it("should handle situation logged event with valid payload", async () => {
    const event = {
      id: "test-event-id",
      createdAt: 1234567890,
      name: Emotions.Events.SITUATION_LOGGED_EVENT,
      stream: "test-stream",
      version: 1,
      payload: {
        id: "test-entry-id",
        description: "Had a difficult conversation",
        kind: Emotions.VO.SituationKindOptions.conflict,
        location: "work",
      },
    } as Emotions.Events.SituationLoggedEventType;

    await onSituationLoggedEvent(event);

    expect(mockLogSituation).toHaveBeenCalledWith(event);
  });
}); 