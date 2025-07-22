import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const positiveMaladaptiveEntry = Emotions.Aggregates.Entry.build(mocks.entryId, [
  mocks.GenericSituationLoggedEvent,
  mocks.PositiveEmotionLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

const maladaptiveEntry = Emotions.Aggregates.Entry.build(mocks.entryId, [
  mocks.GenericSituationLoggedEvent,
  mocks.GenericEmotionLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

describe("PatternDetector", () => {
  test("detects multiple patterns", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = Emotions.Services.PatternDetector.detect({
        entries: [
          maladaptiveEntry,
          maladaptiveEntry,
          maladaptiveEntry,
          positiveMaladaptiveEntry,
          positiveMaladaptiveEntry,
          positiveMaladaptiveEntry,
        ],
        patterns: [
          Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern,
          Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern,
        ],
        dateRange: mocks.dateRange,
        userId: mocks.userId,
      });

      expect(result).toEqual([
        mocks.MultipleMaladaptiveReactionsPatternDetectedEvent,
        mocks.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent,
      ]);
    });
  });
});
