import { describe, expect, test } from "bun:test";

import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const positiveMaladaptiveEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
  mocks.GenericSituationLoggedEvent,
  mocks.PositiveEmotionLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

const maladaptiveJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
  mocks.GenericSituationLoggedEvent,
  mocks.GenericEmotionLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

describe("PatternDetector", () => {
  test("detects multiple patterns", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [
        maladaptiveJournalEntry,
        maladaptiveJournalEntry,
        maladaptiveJournalEntry,
        positiveMaladaptiveEntry,
        positiveMaladaptiveEntry,
        positiveMaladaptiveEntry,
      ],
      patterns: [
        Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern,
        Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern,
      ],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([
      mocks.MultipleMaladaptiveReactionsPatternDetectedEvent,
      mocks.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent,
    ]);
  });
});
