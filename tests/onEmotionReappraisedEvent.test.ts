import { beforeEach, describe, expect, it, mock } from "bun:test";
import * as Emotions from "../modules/emotions";
import { onEmotionReappraisedEvent } from "../modules/emotions/handlers/onEmotionReappraisedEvent";
import { GenericEmotionReappraisedEvent } from "./mocks";

// Mock the repository
const mockReappraiseEmotion = mock(() => Promise.resolve());

mock.module("../modules/emotions/repositories", () => ({
  EmotionJournalEntryRepository: {
    reappraiseEmotion: mockReappraiseEmotion,
  },
}));

describe("onEmotionReappraisedEvent", () => {
  beforeEach(() => {
    mockReappraiseEmotion.mockClear();
  });

  it("should call repository reappraiseEmotion method with the event", async () => {
    await onEmotionReappraisedEvent(GenericEmotionReappraisedEvent);

    expect(mockReappraiseEmotion).toHaveBeenCalledTimes(1);
    expect(mockReappraiseEmotion).toHaveBeenCalledWith(GenericEmotionReappraisedEvent);
  });

  it("should handle emotion reappraised event with valid payload", async () => {
    const event = {
      id: "test-event-id",
      createdAt: 1234567890,
      name: Emotions.Events.EMOTION_REAPPRAISED_EVENT,
      stream: "test-stream",
      version: 1,
      payload: {
        id: "test-entry-id",
        newLabel: Emotions.VO.GenevaWheelEmotion.joy,
        newIntensity: 4,
      },
    } as Emotions.Events.EmotionReappraisedEventType;

    await onEmotionReappraisedEvent(event);

    expect(mockReappraiseEmotion).toHaveBeenCalledWith(event);
  });
});
