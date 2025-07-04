import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as Emotions from "../modules/emotions";
import * as mocks from "./mocks";

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

describe("EmotionJournalEntry", () => {
  test("create new aggregate", () => {
    expect(() => Emotions.Aggregates.EmotionJournalEntry.create(mocks.emotionJournalEntryId)).not.toThrow();
  });

  test("build new aggregate", () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      mocks.emotionJournalEntryId,
      [],
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logSituation - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      mocks.emotionJournalEntryId,
      [],
    );

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      emotionJournalEntry.logSituation(situation),
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([mocks.GenericSituationLoggedEvent]);
  });

  test("logSituation - Policies.OneSituationPerEntry", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
    ]);

    expect(async () => emotionJournalEntry.logSituation(situation)).toThrow(
      Emotions.Policies.OneSituationPerEntry.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logEmotion - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => emotionJournalEntry.logEmotion(emotion));

    expect(emotionJournalEntry.pullEvents()).toEqual([mocks.GenericEmotionLoggedEvent]);
  });

  test("logEmotion - Policies.OneEmotionPerEmotionJournalEntry", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    expect(async () => emotionJournalEntry.logEmotion(emotion)).toThrow(
      Emotions.Policies.OneEmotionPerEntry.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logEmotion - Policies.EmotionCorrespondsToSituation", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      mocks.emotionJournalEntryId,
      [],
    );

    expect(async () => emotionJournalEntry.logEmotion(emotion)).toThrow(
      Emotions.Policies.EmotionCorrespondsToSituation.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logReaction - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      emotionJournalEntry.logReaction(reaction),
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([mocks.GenericReactionLoggedEvent]);
  });

  test("logReaction - Policies.OneReactionPerEmotionJournalEntry", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);

    expect(async () => emotionJournalEntry.logReaction(reaction)).toThrow(
      Emotions.Policies.OneReactionPerEntry.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing situation and emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      mocks.emotionJournalEntryId,
      [],
    );

    expect(async () => emotionJournalEntry.logReaction(reaction)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
    ]);

    expect(async () => emotionJournalEntry.logReaction(reaction)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("reappraiseEmotion - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      emotionJournalEntry.reappraiseEmotion(newEmotion),
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([mocks.GenericEmotionReappraisedEvent]);
  });

  test("reappraiseEmotion - Policies.EmotionCorrespondsToSituation", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      mocks.emotionJournalEntryId,
      [],
    );

    expect(async () => emotionJournalEntry.reappraiseEmotion(newEmotion)).toThrow(
      Emotions.Policies.EmotionCorrespondsToSituation.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("reappraiseEmotion - Policies.EmotionForReappraisalExists", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
    ]);

    expect(async () => emotionJournalEntry.reappraiseEmotion(newEmotion)).toThrow(
      Emotions.Policies.EmotionForReappraisalExists.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("evaluateReaction - correct path", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      emotionJournalEntry.evaluateReaction(newReaction),
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([mocks.GenericReactionEvaluatedEvent]);
  });

  test("evaluateReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing situation and emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      mocks.emotionJournalEntryId,
      [],
    );

    expect(async () => emotionJournalEntry.evaluateReaction(newReaction)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("evaluateReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
    ]);

    expect(async () => emotionJournalEntry.evaluateReaction(newReaction)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("evaluateReaction - Policies.ReactionForEvaluationExists - missing emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    expect(async () => emotionJournalEntry.evaluateReaction(newReaction)).toThrow(
      Emotions.Policies.ReactionForEvaluationExists.error,
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("delete - correct path - after situation", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => emotionJournalEntry.delete());

    expect(emotionJournalEntry.pullEvents()).toEqual([mocks.GenericEmotionJournalEntryDeletedEvent]);
  });

  test("delete - correct path - after emotion", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => emotionJournalEntry.delete());

    expect(emotionJournalEntry.pullEvents()).toEqual([mocks.GenericEmotionJournalEntryDeletedEvent]);
  });

  test("delete - correct path - after reaction", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => emotionJournalEntry.delete());

    expect(emotionJournalEntry.pullEvents()).toEqual([mocks.GenericEmotionJournalEntryDeletedEvent]);
  });

  test("delete - EntryHasBenStarted", async () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      mocks.emotionJournalEntryId,
      [],
    );

    expect(async () => emotionJournalEntry.delete()).toThrow(Emotions.Policies.EntryHasBenStarted.error);

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("summarize - full entry", () => {
    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(mocks.emotionJournalEntryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);

    const summary = emotionJournalEntry.summarize();

    expect(Object.keys(summary)).toEqual([
      "id",
      "startedAt",
      "finishedAt",
      "situation",
      "emotion",
      "reaction",
      "status",
    ]);
  });
});
