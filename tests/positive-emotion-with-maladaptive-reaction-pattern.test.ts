import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

describe("PositiveEmotionWithMaladaptiveReactionPattern", () => {
  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = new Emotions.Services.PatternDetector(deps).detect({
        entries: [
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
        ],
        patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
        week: mocks.week,
        userId: mocks.userId,
      });
      expect(result).toEqual([mocks.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent]);
    });
  });

  test("false", () => {
    const result = new Emotions.Services.PatternDetector(deps).detect({
      entries: [mocks.positiveMaladaptiveEntry, mocks.positiveMaladaptiveEntry],
      patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
      week: mocks.week,
      userId: mocks.userId,
    });
    expect(result).toEqual([]);
  });

  test("mixed (still false)", () => {
    const result = new Emotions.Services.PatternDetector(deps).detect({
      entries: [mocks.positiveMaladaptiveEntry, mocks.positiveMaladaptiveEntry, mocks.positiveAdaptiveEntry],
      patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
      week: mocks.week,
      userId: mocks.userId,
    });
    expect(result).toEqual([]);
  });
});
