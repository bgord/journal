import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const maladaptiveJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
  mocks.GenericSituationLoggedEvent,
  mocks.GenericEmotionLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

describe("LowCopingEffectivenessPattern", () => {
  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = Emotions.Services.PatternDetector.detect({
        entries: [maladaptiveJournalEntry, maladaptiveJournalEntry, maladaptiveJournalEntry],
        patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
        dateRange: mocks.dateRange,
      });

      expect(result).toEqual([mocks.LowCopingEffectivenessPatternDetectedEvent]);
    });
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [],
      patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([]);
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [maladaptiveJournalEntry, maladaptiveJournalEntry],
      patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([]);
  });
});
