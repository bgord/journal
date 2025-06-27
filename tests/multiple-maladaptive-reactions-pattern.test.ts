import { describe, expect, test } from "bun:test";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const maladaptiveJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
  mocks.GenericSituationLoggedEvent,
  mocks.GenericEmotionLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

describe.skip("MultipleMaladaptiveReactionsInWeekPattern", () => {
  test("true", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [maladaptiveJournalEntry, maladaptiveJournalEntry, maladaptiveJournalEntry],
      patterns: [Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([mocks.MultipleMaladaptiveReactionsPatternDetectedEvent]);
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [maladaptiveJournalEntry, maladaptiveJournalEntry],
      patterns: [Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([]);
  });
});
