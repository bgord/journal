import { SupportedLanguages } from "+infra/i18n";
import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
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

const language = SupportedLanguages.en;

describe("entry", () => {
  test("create new aggregate", () => {
    expect(() => Emotions.Aggregates.Entry.create(mocks.entryId)).not.toThrow();
  });

  test("build new aggregate", () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, []);

    expect(entry.pullEvents()).toEqual([]);
  });

  test("log - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, []);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      entry.log(situation, emotion, reaction, language, mocks.userId),
    );

    expect(entry.pullEvents()).toEqual([
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);
  });

  test("logSituation - Policies.OneSituationPerEntry", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent]);

    expect(async () => entry.log(situation, emotion, reaction, language, mocks.userId)).toThrow(
      Emotions.Policies.OneSituationPerEntry.error,
    );

    expect(entry.pullEvents()).toEqual([]);
  });

  test("reappraiseEmotion - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      entry.reappraiseEmotion(newEmotion, mocks.userId),
    );

    expect(entry.pullEvents()).toEqual([mocks.GenericEmotionReappraisedEvent]);
  });

  test("reappraiseEmotion - Policies.EmotionCorrespondsToSituation", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, []);

    expect(async () => entry.reappraiseEmotion(newEmotion, mocks.userId)).toThrow(
      Emotions.Policies.EmotionCorrespondsToSituation.error,
    );

    expect(entry.pullEvents()).toEqual([]);
  });

  test("reappraiseEmotion - Policies.EmotionForReappraisalExists", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent]);

    expect(async () => entry.reappraiseEmotion(newEmotion, mocks.userId)).toThrow(
      Emotions.Policies.EmotionForReappraisalExists.error,
    );

    expect(entry.pullEvents()).toEqual([]);
  });

  test("evaluateReaction - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () =>
      entry.evaluateReaction(newReaction, mocks.userId),
    );

    expect(entry.pullEvents()).toEqual([mocks.GenericReactionEvaluatedEvent]);
  });

  test("evaluateReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing situation and emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, []);

    expect(async () => entry.evaluateReaction(newReaction, mocks.userId)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(entry.pullEvents()).toEqual([]);
  });

  test("evaluateReaction - Policies.ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent]);

    expect(async () => entry.evaluateReaction(newReaction, mocks.userId)).toThrow(
      Emotions.Policies.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(entry.pullEvents()).toEqual([]);
  });

  test("evaluateReaction - Policies.ReactionForEvaluationExists - missing emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    expect(async () => entry.evaluateReaction(newReaction, mocks.userId)).toThrow(
      Emotions.Policies.ReactionForEvaluationExists.error,
    );

    expect(entry.pullEvents()).toEqual([]);
  });

  test("delete - correct path - after situation", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => entry.delete(mocks.userId));

    expect(entry.pullEvents()).toEqual([mocks.GenericEntryDeletedEvent]);
  });

  test("delete - correct path - after emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => entry.delete(mocks.userId));

    expect(entry.pullEvents()).toEqual([mocks.GenericEntryDeletedEvent]);
  });

  test("delete - correct path - after reaction", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, async () => entry.delete(mocks.userId));

    expect(entry.pullEvents()).toEqual([mocks.GenericEntryDeletedEvent]);
  });

  test("delete - EntryHasBenStarted", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, []);

    expect(async () => entry.delete(mocks.userId)).toThrow(Emotions.Policies.EntryHasBenStarted.error);

    expect(entry.pullEvents()).toEqual([]);
  });

  test("summarize - full entry", () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);

    const summary = entry.summarize();

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
