import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";

import * as Emotions from "../modules/emotions";

const id = bg.NewUUID.generate();

const MaladaptiveSituationLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.SITUATION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "I lost a game",
    kind: Emotions.VO.SituationKindOptions.failure,
    location: "pitch",
  },
} satisfies Emotions.Aggregates.SituationLoggedEventType;

const MaladaptiveEmotionLoggedEvent = {
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

const MaladaptiveReactionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.REACTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "Got drunk",
    type: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
    effectiveness: 1,
  },
} satisfies Emotions.Aggregates.ReactionLoggedEventType;

const maladaptiveJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [
  MaladaptiveSituationLoggedEvent,
  MaladaptiveEmotionLoggedEvent,
  MaladaptiveReactionLoggedEvent,
]);

describe("MultipleMaladaptiveReactionsInWeekPattern", () => {
  test("true", () => {
    const result = Emotions.Services.PatternDetector.detect(
      [maladaptiveJournalEntry, maladaptiveJournalEntry, maladaptiveJournalEntry],
      [new Emotions.Services.MultipleMaladaptiveReactionsInWeekPattern()],
    );

    expect(result).toEqual([
      {
        detected: true,
        name: Emotions.Services.MultipleMaladaptiveReactionsInWeekPattern.name,
      },
    ]);
  });

  test("false", () => {
    const result = Emotions.Services.PatternDetector.detect(
      [maladaptiveJournalEntry, maladaptiveJournalEntry],
      [new Emotions.Services.MultipleMaladaptiveReactionsInWeekPattern()],
    );

    expect(result).toEqual([]);
  });
});
