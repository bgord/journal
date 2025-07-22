import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const positiveEmotionEntry = Emotions.Aggregates.Entry.build(mocks.entryId, [
  mocks.GenericSituationLoggedEvent,
  mocks.PositiveEmotionLoggedEvent,
  mocks.GenericReactionLoggedEvent,
]);

const negativeEmotionEntry = Emotions.Aggregates.Entry.build(mocks.entryId, [
  mocks.GenericSituationLoggedEvent,
  mocks.NegativeEmotionLoggedEvent,
  mocks.GenericReactionLoggedEvent,
]);

describe("MoreNegativeThanPositiveEmotionsPattern", () => {
  test("true", () => {
    bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = Emotions.Services.PatternDetector.detect({
        entries: [negativeEmotionEntry, negativeEmotionEntry, positiveEmotionEntry],
        patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
        week: mocks.week,
        userId: mocks.userId,
      });

      expect(result).toEqual([mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent]);
    });
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [negativeEmotionEntry, positiveEmotionEntry, positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });

  test("false - equal amount", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [negativeEmotionEntry, positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });
});
