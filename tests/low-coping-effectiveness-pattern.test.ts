import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import * as mocks from "./mocks";

describe("LowCopingEffectivenessPattern", () => {
  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = Emotions.Services.PatternDetector.detect({
        entries: [
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
        ],
        patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
        week: mocks.week,
        userId: mocks.userId,
      });
      expect(result).toEqual([mocks.LowCopingEffectivenessPatternDetectedEvent]);
    });
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [],
      patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
      week: mocks.week,
      userId: mocks.userId,
    });
    expect(result).toEqual([]);
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [mocks.positiveAdaptiveEntry, mocks.positiveAdaptiveEntry],
      patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
      week: mocks.week,
      userId: mocks.userId,
    });
    expect(result).toEqual([]);
  });
});
