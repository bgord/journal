import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

describe("PatternDetector", () => {
  test("detects multiple patterns", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = new Emotions.Services.PatternDetector(Adapters.IdProvider).detect({
        entries: [
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
          mocks.positiveMaladaptiveEntry,
        ],
        patterns: [
          Emotions.Services.Patterns.MaladaptiveReactionsPattern,
          Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern,
        ],
        week: mocks.week,
        userId: mocks.userId,
      });
      expect(result.length).toEqual(2);
    });
  });
});
