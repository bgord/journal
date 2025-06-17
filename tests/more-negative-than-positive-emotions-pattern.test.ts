import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";

import * as Emotions from "../modules/emotions";

const id = bg.NewUUID.generate();

const SituationLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.SITUATION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "I finished a project",
    kind: Emotions.VO.SituationKindOptions.achievement,
    location: "work",
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

const NegativeEmotionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    label: Emotions.VO.GenevaWheelEmotion.anger,
    intensity: 4,
  },
} satisfies Emotions.Aggregates.EmotionLoggedEventType;

const ReactionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.REACTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "Got drunk",
    type: Emotions.VO.GrossEmotionRegulationStrategy.distraction,
    effectiveness: 1,
  },
} satisfies Emotions.Aggregates.ReactionLoggedEventType;

const positiveEmotionEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [
  SituationLoggedEvent,
  PositiveEmotionLoggedEvent,
  ReactionLoggedEvent,
]);

const negativeEmotionEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [
  SituationLoggedEvent,
  NegativeEmotionLoggedEvent,
  ReactionLoggedEvent,
]);

describe("PositiveEmotionWithMaladaptiveReactionPattern", () => {
  test("true", () => {
    const result = Emotions.Services.PatternDetector.detect(
      [negativeEmotionEntry, negativeEmotionEntry, positiveEmotionEntry],
      [new Emotions.Services.MoreNegativeThanPositiveEmotionsPattern()],
    );

    expect(result).toEqual([
      {
        detected: true,
        name: Emotions.Services.MoreNegativeThanPositiveEmotionsPattern.name,
      },
    ]);
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect(
      [negativeEmotionEntry, positiveEmotionEntry, positiveEmotionEntry],
      [new Emotions.Services.MoreNegativeThanPositiveEmotionsPattern()],
    );

    expect(result).toEqual([]);
  });

  test("false - equal amount", () => {
    const result = Emotions.Services.PatternDetector.detect(
      [negativeEmotionEntry, positiveEmotionEntry],
      [new Emotions.Services.MoreNegativeThanPositiveEmotionsPattern()],
    );

    expect(result).toEqual([]);
  });
});
