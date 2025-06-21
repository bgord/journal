import { describe, expect, jest, spyOn, test } from "bun:test";
import { onReactionEvaluatedEvent } from "../modules/emotions/handlers/onReactionEvaluatedEvent";
import { EmotionJournalEntryRepository } from "../modules/emotions/repositories/";
import { GenericReactionEvaluatedEvent } from "./mocks";

describe("onReactionEvaluatedEvent", () => {
  test("should call repository evaluateReaction method with the event", async () => {
    const evaluateReaction = spyOn(EmotionJournalEntryRepository, "evaluateReaction").mockImplementation(
      jest.fn(),
    );

    await onReactionEvaluatedEvent(GenericReactionEvaluatedEvent);

    expect(evaluateReaction).toHaveBeenCalledTimes(1);
    expect(evaluateReaction).toHaveBeenCalledWith(GenericReactionEvaluatedEvent);

    evaluateReaction.mockRestore();
  });
});
