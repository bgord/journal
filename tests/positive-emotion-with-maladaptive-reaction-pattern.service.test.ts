import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

describe("PositiveEmotionWithMaladaptiveReactionPattern", async () => {
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
        patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
        week: mocks.week,
        userId: mocks.userId,
      });

      expect(result).toEqual([mocks.PositiveEmotionWithMaladaptiveReactionPatternDetectedEvent]);
    });
  });

  test("false - not enough", () => {
    const result = detector.detect({
      entries: [mocks.positiveMaladaptiveEntry, mocks.positiveMaladaptiveEntry],
      patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });

  test("false - mixed", () => {
    const result = detector.detect({
      entries: [mocks.positiveMaladaptiveEntry, mocks.positiveMaladaptiveEntry, mocks.positiveAdaptiveEntry],
      patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });

  test("false - negative emotions", () => {
    const result = detector.detect({
      entries: [
        mocks.positiveMaladaptiveEntry,
        mocks.positiveMaladaptiveEntry,
        { ...mocks.positiveMaladaptiveEntry, emotionLabel: Emotions.VO.GenevaWheelEmotion.anger },
      ],
      patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });

  test("false - adaptive reaction", () => {
    const result = detector.detect({
      entries: [mocks.positiveMaladaptiveEntry, mocks.positiveMaladaptiveEntry, mocks.positiveAdaptiveEntry],
      patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });

  test("false - missing reaction", () => {
    const result = detector.detect({
      entries: [
        mocks.positiveMaladaptiveEntry,
        mocks.positiveMaladaptiveEntry,
        { ...mocks.positiveMaladaptiveEntry, reactionType: null },
      ],
      patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });

  test("false - missing emotion", () => {
    const result = detector.detect({
      entries: [
        mocks.positiveMaladaptiveEntry,
        mocks.positiveMaladaptiveEntry,
        { ...mocks.positiveMaladaptiveEntry, emotionLabel: null },
      ],
      patterns: [Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern],
      week: mocks.week,
      userId: mocks.userId,
    });

    expect(result).toEqual([]);
  });
});
