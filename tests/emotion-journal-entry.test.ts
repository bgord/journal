import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";

import * as Emotions from "../modules/emotions";

describe("EmotionJournalEntry", () => {
  test("build new aggregate", () => {
    const id = bg.NewUUID.generate();

    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logSituation - correct path", async () => {
    const id = bg.NewUUID.generate();

    const situation = new Emotions.Entities.Situation(
      new Emotions.VO.SituationDescription("I finished a project"),
      new Emotions.VO.SituationLocation("work"),
      new Emotions.VO.SituationKind(Emotions.VO.SituationKindOptions.achievement),
    );

    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    await emotionJournalEntry.logSituation(situation);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      {
        type: "situation.logged",
        id,
        situation: {
          description: "I finished a project",
          kind: Emotions.VO.SituationKindOptions.achievement,
          location: "work",
        },
      },
    ]);
  });

  test("logSituation - applied only once", async () => {
    const id = bg.NewUUID.generate();

    const situation = new Emotions.Entities.Situation(
      new Emotions.VO.SituationDescription("I finished a project"),
      new Emotions.VO.SituationLocation("work"),
      new Emotions.VO.SituationKind(Emotions.VO.SituationKindOptions.achievement),
    );

    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    await emotionJournalEntry.logSituation(situation);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      {
        type: "situation.logged",
        id,
        situation: {
          description: "I finished a project",
          kind: Emotions.VO.SituationKindOptions.achievement,
          location: "work",
        },
      },
    ]);

    expect(async () => emotionJournalEntry.logSituation(situation)).toThrow(
      Emotions.Policies.OneSituationPerEmotionJournalEntry.error,
    );
  });

  test("logEmotion - correct path", async () => {
    const id = bg.NewUUID.generate();

    const situation = new Emotions.Entities.Situation(
      new Emotions.VO.SituationDescription("I finished a project"),
      new Emotions.VO.SituationLocation("work"),
      new Emotions.VO.SituationKind(Emotions.VO.SituationKindOptions.achievement),
    );

    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    await emotionJournalEntry.logSituation(situation);

    const emotion = new Emotions.Entities.Emotion(
      new Emotions.VO.EmotionLabel(Emotions.VO.GenevaWheelEmotion.gratitude),
      new Emotions.VO.EmotionIntensity(3),
    );

    await emotionJournalEntry.logEmotion(emotion);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      {
        type: "situation.logged",
        id,
        situation: {
          description: "I finished a project",
          kind: Emotions.VO.SituationKindOptions.achievement,
          location: "work",
        },
      },
      {
        type: "emotion.logged",
        id,
        emotion: {
          label: Emotions.VO.GenevaWheelEmotion.gratitude,
          intensity: 3,
        },
      },
    ]);
  });

  test("logEmotion - applied only once", async () => {
    const id = bg.NewUUID.generate();

    const situation = new Emotions.Entities.Situation(
      new Emotions.VO.SituationDescription("I finished a project"),
      new Emotions.VO.SituationLocation("work"),
      new Emotions.VO.SituationKind(Emotions.VO.SituationKindOptions.achievement),
    );

    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    await emotionJournalEntry.logSituation(situation);

    const emotion = new Emotions.Entities.Emotion(
      new Emotions.VO.EmotionLabel(Emotions.VO.GenevaWheelEmotion.gratitude),
      new Emotions.VO.EmotionIntensity(3),
    );

    await emotionJournalEntry.logEmotion(emotion);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      {
        type: "situation.logged",
        id,
        situation: {
          description: "I finished a project",
          kind: Emotions.VO.SituationKindOptions.achievement,
          location: "work",
        },
      },
      {
        type: "emotion.logged",
        id,
        emotion: {
          label: Emotions.VO.GenevaWheelEmotion.gratitude,
          intensity: 3,
        },
      },
    ]);

    expect(async () => emotionJournalEntry.logEmotion(emotion)).toThrow(
      Emotions.Policies.OneEmotionPerEmotionJournalEntry.error,
    );
  });

  test("logEmotion - emotion corresponds to situation", async () => {
    const id = bg.NewUUID.generate();

    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(id, []);

    const emotion = new Emotions.Entities.Emotion(
      new Emotions.VO.EmotionLabel(Emotions.VO.GenevaWheelEmotion.gratitude),
      new Emotions.VO.EmotionIntensity(3),
    );

    expect(async () => emotionJournalEntry.logEmotion(emotion)).toThrow(
      Emotions.Policies.EmotionCorrespondsToSituation.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });
});
