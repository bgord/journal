import { describe, expect, test } from "bun:test";

import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

const maladaptiveJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.id, [
  mocks.GenericSituationLoggedEvent,
  mocks.GenericEmotionLoggedEvent,
  mocks.MaladaptiveReactionLoggedEvent,
]);

describe("MultipleMaladaptiveReactionsInWeekPattern", () => {
  test("true", () => {
    const result = Emotions.Services.PatternDetector.detect(
      [maladaptiveJournalEntry, maladaptiveJournalEntry, maladaptiveJournalEntry],
      [new Emotions.Services.Patterns.MultipleMaladaptiveReactionsInWeekPattern()],
    );

    expect(result).toEqual([
      {
        detected: true,
        name: Emotions.Services.Patterns.MultipleMaladaptiveReactionsInWeekPattern.name,
      },
    ]);
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect(
      [maladaptiveJournalEntry, maladaptiveJournalEntry],
      [new Emotions.Services.Patterns.MultipleMaladaptiveReactionsInWeekPattern()],
    );

    expect(result).toEqual([]);
  });
});
