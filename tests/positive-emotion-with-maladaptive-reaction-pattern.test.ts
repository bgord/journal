import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";

import * as Emotions from "../modules/emotions";

const id = bg.NewUUID.generate();

const PositiveSituationLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.SITUATION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "Won a prize",
    kind: Emotions.VO.SituationKindOptions.achievement,
    location: "home",
  },
} satisfies Emotions.Aggregates.SituationLoggedEventType;

const PositiveEmotionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    label: Emotions.VO.GenevaWheelEmotion.joy,
    intensity: 4,
  },
} satisfies Emotions.Aggregates.EmotionLoggedEventType;

const MaladaptiveReactionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.REACTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "Overate junk food",
    type: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
    effectiveness: 2,
  },
} satisfies Emotions.Aggregates.ReactionLoggedEventType;

const positiveMaladaptiveEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [
  PositiveSituationLoggedEvent,
  PositiveEmotionLoggedEvent,
  MaladaptiveReactionLoggedEvent,
]);

describe("PositiveEmotionWithMaladaptiveReactionPattern", () => {
  test("true", () => {
    const result = Emotions.Services.PatternDetector.detect(
      [positiveMaladaptiveEntry, positiveMaladaptiveEntry, positiveMaladaptiveEntry],
      [new Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern()],
    );

    expect(result).toEqual([
      {
        detected: true,
        name: Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern.name,
      },
    ]);
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect(
      [positiveMaladaptiveEntry, positiveMaladaptiveEntry],
      [new Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern()],
    );

    expect(result).toEqual([]);
  });

  test("mixed (still false)", () => {
    const neutralEmotionLoggedEvent = {
      id: expect.any(String),
      createdAt: expect.any(Number),
      name: Emotions.Aggregates.EMOTION_LOGGED_EVENT,
      stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
      version: 1,
      payload: {
        id,
        label: Emotions.VO.GenevaWheelEmotion.boredom,
        intensity: 3,
      },
    } satisfies Emotions.Aggregates.EmotionLoggedEventType;

    const adaptiveReactionLoggedEvent = {
      id: expect.any(String),
      createdAt: expect.any(Number),
      name: Emotions.Aggregates.REACTION_LOGGED_EVENT,
      stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
      version: 1,
      payload: {
        id,
        description: "Went for a walk",
        type: Emotions.VO.GrossEmotionRegulationStrategy.reappraisal,
        effectiveness: 4,
      },
    } satisfies Emotions.Aggregates.ReactionLoggedEventType;

    const nonMatchingEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [
      PositiveSituationLoggedEvent,
      neutralEmotionLoggedEvent,
      adaptiveReactionLoggedEvent,
    ]);

    const result = Emotions.Services.PatternDetector.detect(
      [positiveMaladaptiveEntry, positiveMaladaptiveEntry, nonMatchingEntry],
      [new Emotions.Services.Patterns.PositiveEmotionWithMaladaptiveReactionPattern()],
    );

    expect(result).toEqual([]);
  });
});
