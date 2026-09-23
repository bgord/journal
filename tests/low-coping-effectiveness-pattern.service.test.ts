import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("LowCopingEffectivenessPattern", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };
  const detector = new Emotions.Services.PatternDetector(deps);

  test("true - mean 1", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = detector.detect({
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

  test("true - mean 1 - with partial entries", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = detector.detect({
        entries: [
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.partialEntry,
          mocks.partialEntry,
        ],
        patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
        week: mocks.week,
        userId: mocks.userId,
      });

      expect(result).toEqual([mocks.LowCopingEffectivenessPatternDetectedEvent]);
    });
  });

  test("false - no entries", () => {
    const result = detector.detect({
      entries: [],
      patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });

  test("false - under threshold", () => {
    const result = detector.detect({
      entries: [mocks.positiveAdaptiveEntry, mocks.positiveAdaptiveEntry],
      patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });

  test("false - mean 3", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, () => {
      const three = { ...mocks.positiveMaladaptiveEntry, reactionEffectiveness: 3 };

      const result = detector.detect({
        entries: [three, three, three],
        patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
        week: mocks.week,
        userId: mocks.userId,
      });

      expect(result).toEqual([]);
    });
  });
});
