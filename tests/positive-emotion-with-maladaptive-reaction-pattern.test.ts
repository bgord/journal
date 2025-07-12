import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const positiveMaladaptiveEntry = Emotions.Aggregates.Entry.build(mocks.entryId, [
  mocks.GenericSituationLoggedEvent,
  mocks.PositiveEmotionLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

const positiveAdaptiveEntry = Emotions.Aggregates.Entry.build(mocks.entryId, [
  mocks.GenericSituationLoggedEvent,
  mocks.PositiveEmotionLoggedEvent,
  mocks.AdaptiveReactionLoggedEvent,
]);

describe("PositiveEmotionWithMaladaptiveReactionPattern", () => {
  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = Emotions.Services.PatternDetector.detect({
        entries: [positiveMaladaptiveEntry, positiveMaladaptiveEntry, positiveMaladaptiveEntry],
        patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
        dateRange: mocks.dateRange,
      });

      expect(result).toEqual([mocks.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent]);
    });
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [positiveMaladaptiveEntry, positiveMaladaptiveEntry],
      patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([]);
  });

  test("mixed (still false)", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [positiveMaladaptiveEntry, positiveMaladaptiveEntry, positiveAdaptiveEntry],
      patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([]);
  });
});
