import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import * as mocks from "./mocks";

describe("MoreNegativeThanPositiveEmotionsPattern", () => {
  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = Emotions.Services.PatternDetector.detect({
        entries: [mocks.negativeEmotionEntry, mocks.negativeEmotionEntry, mocks.positiveEmotionEntry],
        patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
        week: mocks.week,
        userId: mocks.userId,
      });
      expect(result).toEqual([mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent]);
    });
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [mocks.negativeEmotionEntry, mocks.positiveEmotionEntry, mocks.positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });
    expect(result).toEqual([]);
  });

  test("false - equal amount", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [mocks.negativeEmotionEntry, mocks.positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });
    expect(result).toEqual([]);
  });
});
