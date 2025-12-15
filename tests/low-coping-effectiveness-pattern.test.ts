import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("LowCopingEffectivenessPattern", async () => {
  const di = await bootstrap(mocks.Env);
  const detector = new Emotions.Services.PatternDetector(di.Adapters.System);

  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
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

  test("false", () => {
    const result = detector.detect({
      entries: [],
      patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
      week: mocks.week,
      userId: mocks.userId,
    });
    expect(result).toEqual([]);
  });

  test("false", () => {
    const result = detector.detect({
      entries: [mocks.positiveAdaptiveEntry, mocks.positiveAdaptiveEntry],
      patterns: [Emotions.Services.Patterns.LowCopingEffectivenessPattern],
      week: mocks.week,
      userId: mocks.userId,
    });
    expect(result).toEqual([]);
  });
});
