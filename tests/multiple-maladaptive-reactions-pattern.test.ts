import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const maladaptiveEntry = Emotions.Aggregates.Entry.build(mocks.entryId, [
  mocks.GenericSituationLoggedEvent,
  mocks.GenericEmotionLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

describe("MultipleMaladaptiveReactionsInWeekPattern", () => {
  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = Emotions.Services.PatternDetector.detect({
        entries: [maladaptiveEntry, maladaptiveEntry, maladaptiveEntry],
        patterns: [Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern],
        dateRange: mocks.dateRange,
      });

      expect(result).toEqual([mocks.MultipleMaladaptiveReactionsPatternDetectedEvent]);
    });
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [maladaptiveEntry, maladaptiveEntry],
      patterns: [Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([]);
  });
});
