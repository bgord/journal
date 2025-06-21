import { beforeEach, describe, expect, it, mock } from "bun:test";
import * as Emotions from "../modules/emotions";
import { onEmotionLoggedEvent } from "../modules/emotions/handlers/onEmotionLoggedEvent";
import { GenericEmotionLoggedEvent } from "./mocks";

// Mock the repository
const mockLogEmotion = mock(() => Promise.resolve());

mock.module("../modules/emotions/repositories", () => ({
  EmotionJournalEntryRepository: {
    logEmotion: mockLogEmotion,
  },
}));

describe("onEmotionLoggedEvent", () => {
  beforeEach(() => {
    mockLogEmotion.mockClear();
  });

  it("should call repository logEmotion method with the event", async () => {
    await onEmotionLoggedEvent(GenericEmotionLoggedEvent);

    expect(mockLogEmotion).toHaveBeenCalledTimes(1);
    expect(mockLogEmotion).toHaveBeenCalledWith(GenericEmotionLoggedEvent);
  });

  it("should handle emotion logged event with valid payload", async () => {
    const event = {
      id: "test-event-id",
      createdAt: 1234567890,
      name: Emotions.Events.EMOTION_LOGGED_EVENT,
      stream: "test-stream",
      version: 1,
      payload: {
        id: "test-entry-id",
        label: Emotions.VO.GenevaWheelEmotion.joy,
        intensity: 5,
      },
    } as Emotions.Events.EmotionLoggedEventType;

    await onEmotionLoggedEvent(event);

    expect(mockLogEmotion).toHaveBeenCalledWith(event);
  });
});
