import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("MaladaptiveReactionsInWeekPattern", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };
  const detector = new Emotions.Services.PatternDetector(deps);

  test("true", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = detector.detect({
        entries: [
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
        ],
        patterns: [Emotions.Services.Patterns.MaladaptiveReactionsPattern],
        week: mocks.week,
        userId: mocks.userId,
      });

      expect(result).toEqual([mocks.MaladaptiveReactionsPatternDetectedEvent]);
    });
  });

  test("false - under threshold", () => {
    const result = detector.detect({
      entries: [mocks.positiveMaladaptiveEntry, mocks.positiveMaladaptiveEntry],
      patterns: [Emotions.Services.Patterns.MaladaptiveReactionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });

  test("false - no reaction types", () => {
    const result = detector.detect({
      entries: [mocks.positiveMaladaptiveEntry, mocks.positiveMaladaptiveEntry, mocks.partialEntry],
      patterns: [Emotions.Services.Patterns.MaladaptiveReactionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });
});
