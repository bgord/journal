import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";

import * as Emotions from "../modules/emotions";

const situation = new Emotions.Entities.Situation(
  new Emotions.VO.SituationDescription("I finished a project"),
  new Emotions.VO.SituationLocation("work"),
  new Emotions.VO.SituationKind(Emotions.VO.SituationKindOptions.achievement),
);

const emotion = new Emotions.Entities.Emotion(
  new Emotions.VO.EmotionLabel(Emotions.VO.GenevaWheelEmotion.gratitude),
  new Emotions.VO.EmotionIntensity(3),
);

const reaction = new Emotions.Entities.Reaction(
  new Emotions.VO.ReactionDescription("Got drunk"),
  new Emotions.VO.ReactionType(Emotions.VO.GrossEmotionRegulationStrategy.distraction),
  new Emotions.VO.ReactionEffectiveness(1),
);

const newEmotion = new Emotions.Entities.Emotion(
  new Emotions.VO.EmotionLabel(Emotions.VO.GenevaWheelEmotion.joy),
  new Emotions.VO.EmotionIntensity(3),
);

const newReaction = new Emotions.Entities.Reaction(
  new Emotions.VO.ReactionDescription("Went to bed"),
  new Emotions.VO.ReactionType(Emotions.VO.GrossEmotionRegulationStrategy.avoidance),
  new Emotions.VO.ReactionEffectiveness(2),
);

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

const EmotionLoggedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.EMOTION_LOGGED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    label: Emotions.VO.GenevaWheelEmotion.gratitude,
    intensity: 3,
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

const EmotionReappraisedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.EMOTION_REAPPRAISED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    newLabel: Emotions.VO.GenevaWheelEmotion.joy,
    newIntensity: 3,
  },
} satisfies Emotions.Aggregates.EmotionReappraisedEventType;

const ReactionEvaluatedEvent = {
  id: expect.any(String),
  createdAt: expect.any(Number),
  name: Emotions.Aggregates.REACTION_EVALUATED_EVENT,
  stream: Emotions.Aggregates.EmotionJournalEntry.getStream(id),
  version: 1,
  payload: {
    id,
    description: "Went to bed",
    type: Emotions.VO.GrossEmotionRegulationStrategy.avoidance,
    effectiveness: 2,
  },
} satisfies Emotions.Aggregates.ReactionEvaluatedEventType;

describe("EmotionJournalEntry", () => {
  test("build new aggregate", () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logSituation - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    await emotionJournalEntry.logSituation(situation);

    expect(emotionJournalEntry.pullEvents()).toEqual([SituationLoggedEvent]);
  });

  test("logSituation - Policies.OneSituationPerEmotionJournalEntry", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [SituationLoggedEvent]);

    expect(async () => emotionJournalEntry.logSituation(situation)).toThrow(
      Emotions.Policies.OneSituationPerEmotionJournalEntry.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logEmotion - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    await emotionJournalEntry.logSituation(situation);
    await emotionJournalEntry.logEmotion(emotion);

    expect(emotionJournalEntry.pullEvents()).toEqual([SituationLoggedEvent, EmotionLoggedEvent]);
  });

  test("logEmotion - Policies.OneEmotionPerEmotionJournalEntry", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [
      SituationLoggedEvent,
      EmotionLoggedEvent,
    ]);

    expect(async () => emotionJournalEntry.logEmotion(emotion)).toThrow(
      Emotions.Policies.OneEmotionPerEmotionJournalEntry.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logEmotion - Policies.EmotionCorrespondsToSituation", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    expect(async () => emotionJournalEntry.logEmotion(emotion)).toThrow(
      Emotions.Policies.EmotionCorrespondsToSituation.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logReaction - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    await emotionJournalEntry.logSituation(situation);
    await emotionJournalEntry.logEmotion(emotion);
    await emotionJournalEntry.logReaction(reaction);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      SituationLoggedEvent,
      EmotionLoggedEvent,
      ReactionLoggedEvent,
    ]);
  });

  test("logReaction - Policies.OneReactionPerEmotionJournalEntry", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [
      SituationLoggedEvent,
      EmotionLoggedEvent,
      ReactionLoggedEvent,
    ]);

    expect(async () => emotionJournalEntry.logReaction(reaction)).toThrow(
      Emotions.Policies.OneReactionPerEmotionJournalEntry.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing situation and emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    expect(async () => emotionJournalEntry.logReaction(reaction)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [SituationLoggedEvent]);

    expect(async () => emotionJournalEntry.logReaction(reaction)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("reappraiseEmotion - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    await emotionJournalEntry.logSituation(situation);
    await emotionJournalEntry.logEmotion(emotion);
    await emotionJournalEntry.reappraiseEmotion(newEmotion);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      SituationLoggedEvent,
      EmotionLoggedEvent,
      EmotionReappraisedEvent,
    ]);
  });

  test("reappraiseEmotion - Policies.EmotionCorrespondsToSituation", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    expect(async () => emotionJournalEntry.reappraiseEmotion(newEmotion)).toThrow(
      Emotions.Policies.EmotionCorrespondsToSituation.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("reappraiseEmotion - Policies.EmotionForReappraisalExists", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [SituationLoggedEvent]);

    expect(async () => emotionJournalEntry.reappraiseEmotion(newEmotion)).toThrow(
      Emotions.Policies.EmotionForReappraisalExists.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("evaluateReaction - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    await emotionJournalEntry.logSituation(situation);
    await emotionJournalEntry.logEmotion(emotion);
    await emotionJournalEntry.logReaction(reaction);
    await emotionJournalEntry.evaluateReaction(newReaction);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      SituationLoggedEvent,
      EmotionLoggedEvent,
      ReactionLoggedEvent,
      ReactionEvaluatedEvent,
    ]);
  });

  test("evaluateReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing situation and emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    expect(async () => emotionJournalEntry.evaluateReaction(newReaction)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("evaluateReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, [SituationLoggedEvent]);

    expect(async () => emotionJournalEntry.evaluateReaction(newReaction)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });
});
