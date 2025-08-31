import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import * as Adapters from "+infra/adapters";
import * as mocks from "./mocks";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

describe("MoreNegativeThanPositiveEmotionsPattern", () => {
  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = new Emotions.Services.PatternDetector(deps).detect({
        entries: [mocks.negativeEmotionEntry, mocks.negativeEmotionEntry, mocks.positiveEmotionEntry],
        patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
        week: mocks.week,
        userId: mocks.userId,
      });
      expect(result).toEqual([mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent]);
    });
  });

  test("false", () => {
    const result = new Emotions.Services.PatternDetector(deps).detect({
      entries: [mocks.negativeEmotionEntry, mocks.positiveEmotionEntry, mocks.positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });
    expect(result).toEqual([]);
  });

  test("false - equal amount", () => {
    const result = new Emotions.Services.PatternDetector(deps).detect({
      entries: [mocks.negativeEmotionEntry, mocks.positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });
    expect(result).toEqual([]);
  });
});
