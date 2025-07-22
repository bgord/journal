import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

// TODO
// const maladaptiveEntry = Emotions.Aggregates.Entry.build(mocks.entryId, [
//   mocks.GenericSituationLoggedEvent,
//   mocks.GenericEmotionLoggedEvent,
//   mocks.MaladaptiveReactionLoggedEvent,
// ]);

describe("PatternDetector", () => {
  test("detects multiple patterns", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = Emotions.Services.PatternDetector.detect({
        entries: [
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
        ],
        patterns: [
          Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern,
          Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern,
        ],
        week: mocks.week,
        userId: mocks.userId,
      });

      expect(result).toEqual([
        mocks.MultipleMaladaptiveReactionsPatternDetectedEvent,
        mocks.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent,
      ]);
    });
  });
});
