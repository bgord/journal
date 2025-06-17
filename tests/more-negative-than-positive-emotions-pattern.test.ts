import { describe, expect, test } from "bun:test";

import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const positiveEmotionEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
  mocks.GenericSituationLoggedEvent,
  mocks.PositiveEmotionLoggedEvent,
  mocks.GenericReactionLoggedEvent,
]);

const negativeEmotionEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
  mocks.GenericSituationLoggedEvent,
  mocks.NegativeEmotionLoggedEvent,
  mocks.GenericReactionLoggedEvent,
]);

describe("MoreNegativeThanPositiveEmotionsPattern", () => {
  test("true", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [negativeEmotionEntry, negativeEmotionEntry, positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent]);
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [negativeEmotionEntry, positiveEmotionEntry, positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([]);
  });

  test("false - equal amount", () => {
    const result = Emotions.Services.PatternDetector.detect({
      entries: [negativeEmotionEntry, positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      dateRange: mocks.dateRange,
    });

    expect(result).toEqual([]);
  });
});
