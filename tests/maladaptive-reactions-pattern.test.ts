import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import { EnvironmentLoader } from "+infra/env";
import * as mocks from "./mocks";

describe("MaladaptiveReactionsInWeekPattern", async () => {
  const di = await bootstrap(await EnvironmentLoader.load());
  const detector = new Emotions.Services.PatternDetector(di.Adapters.System);

  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
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

  test("false", () => {
    const result = detector.detect({
      entries: [mocks.positiveMaladaptiveEntry, mocks.positiveMaladaptiveEntry],
      patterns: [Emotions.Services.Patterns.MaladaptiveReactionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });
});
