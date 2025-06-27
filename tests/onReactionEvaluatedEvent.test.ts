import { describe, expect, jest, spyOn, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe.skip("onReactionEvaluatedEvent", () => {
  test("should call repository evaluateReaction method with the event", async () => {
    const evaluateReaction = spyOn(
      Emotions.Repos.EmotionJournalEntryRepository,
      "evaluateReaction",
    ).mockImplementation(jest.fn());

    await Emotions.EventHandlers.onReactionEvaluatedEvent(mocks.GenericReactionEvaluatedEvent);

    expect(evaluateReaction).toHaveBeenCalledTimes(1);
    expect(evaluateReaction).toHaveBeenCalledWith(mocks.GenericReactionEvaluatedEvent);

    jest.restoreAllMocks();
  });
});
