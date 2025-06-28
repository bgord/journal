import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const maladaptiveJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
  mocks.GenericSituationLoggedEvent,
  mocks.GenericEmotionLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

describe("MultipleMaladaptiveReactionsInWeekPattern", () => {
  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = Emotions.Services.PatternDetector.detect({
        entries: [maladaptiveJournalEntry, maladaptiveJournalEntry, maladaptiveJournalEntry],
        patterns: [Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern],
        dateRange: mocks.dateRange,
      });

      expect(result).toEqual([mocks.MultipleMaladaptiveReactionsPatternDetectedEvent]);
    });
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
