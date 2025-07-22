import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

describe("MultipleMaladaptiveReactionsInWeekPattern", () => {
  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = Emotions.Services.PatternDetector.detect({
        entries: [
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
        ],
        patterns: [Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern],
        week: mocks.week,
        userId: mocks.userId,
      });

      expect(result).toEqual([mocks.MultipleMaladaptiveReactionsPatternDetectedEvent]);
    });
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [mocks.positiveMaladaptiveEntry, mocks.positiveMaladaptiveEntry],
      patterns: [Emotions.Services.Patterns.MultipleMaladaptiveReactionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });
});
