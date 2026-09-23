import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("MoreNegativeThanPositiveEmotionsPattern", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };
  const detector = new Emotions.Services.PatternDetector(deps);

  test("true", async () => {
    await bg.CorrelationStorage.run(mocks.correlationId, () => {
      const result = detector.detect({
        entries: [mocks.negativeEmotionEntry, mocks.negativeEmotionEntry, mocks.positiveEmotionEntry],
        patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
        week: mocks.previousWeek,
        userId: mocks.userId,
      });

      expect(result).toEqual([mocks.MoreNegativeThanPositiveEmotionsPatternDetectedEvent]);
    });
  });

  test("false", () => {
    const result = detector.detect({
      entries: [mocks.negativeEmotionEntry, mocks.positiveEmotionEntry, mocks.positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });

  test("false - equal amount", () => {
    const result = detector.detect({
      entries: [mocks.negativeEmotionEntry, mocks.positiveEmotionEntry],
      patterns: [Emotions.Services.Patterns.MoreNegativeThanPositiveEmotionsPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });
});
