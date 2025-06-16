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
  new Emotions.VO.ReactionType(
    Emotions.VO.GrossEmotionRegulationStrategy.distraction,
  ),
  new Emotions.VO.ReactionEffectiveness(1),
);

const id = bg.NewUUID.generate();

const SituationLoggedEvent = {
  type: "situation.logged",
  id,
  situation: {
    description: "I finished a project",
    kind: Emotions.VO.SituationKindOptions.achievement,
    location: "work",
  },
} as const;

const EmotionLoggedEvent = {
  type: "emotion.logged",
  id,
  emotion: {
    label: Emotions.VO.GenevaWheelEmotion.gratitude,
    intensity: 3,
  },
} as const;

const ReactionLoggedEvent = {
  type: "reaction.logged",
  id,
  reaction: {
    description: "Got drunk",
    type: Emotions.VO.GrossEmotionRegulationStrategy.distraction,
    effectiveness: 1,
  },
} as const;

describe("EmotionJournalEntry", () => {
  test("build new aggregate", () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logSituation - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    await emotionJournalEntry.logSituation(situation);

    expect(emotionJournalEntry.pullEvents()).toEqual([SituationLoggedEvent]);
  });

  test("logSituation - Policies.OneSituationPerEmotionJournalEntry", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    await emotionJournalEntry.logSituation(situation);

    expect(emotionJournalEntry.pullEvents()).toEqual([SituationLoggedEvent]);

    expect(async () => emotionJournalEntry.logSituation(situation)).toThrow(
      Emotions.Policies.OneSituationPerEmotionJournalEntry.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logEmotion - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    await emotionJournalEntry.logSituation(situation);

    await emotionJournalEntry.logEmotion(emotion);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      SituationLoggedEvent,
      EmotionLoggedEvent,
    ]);
  });

  test("logEmotion - Policies.OneEmotionPerEmotionJournalEntry", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    await emotionJournalEntry.logSituation(situation);

    await emotionJournalEntry.logEmotion(emotion);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      SituationLoggedEvent,
      EmotionLoggedEvent,
    ]);

    expect(async () => emotionJournalEntry.logEmotion(emotion)).toThrow(
      Emotions.Policies.OneEmotionPerEmotionJournalEntry.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logEmotion - Policies.EmotionCorrespondsToSituation", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    expect(async () => emotionJournalEntry.logEmotion(emotion)).toThrow(
      Emotions.Policies.EmotionCorrespondsToSituation.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logReaction - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

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
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    await emotionJournalEntry.logSituation(situation);
    await emotionJournalEntry.logEmotion(emotion);
    await emotionJournalEntry.logReaction(reaction);

    expect(emotionJournalEntry.pullEvents()).toEqual([
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
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    expect(async () => emotionJournalEntry.logReaction(reaction)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    await emotionJournalEntry.logSituation(situation);

    expect(emotionJournalEntry.pullEvents()).toEqual([SituationLoggedEvent]);

    expect(async () => emotionJournalEntry.logReaction(reaction)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });
});
