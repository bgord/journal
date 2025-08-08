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
  test("build new aggregate", () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, []);

    expect(entry.pullEvents()).toEqual([]);
  });

  test("log - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);

    await bg.CorrelationStorage.run(mocks.correlationId, () => {
      const entry = Emotions.Aggregates.Entry.log(
        mocks.entryId,
        situation,
        emotion,
        reaction,
        language,
        mocks.userId,
        Emotions.VO.EntryOriginOption.web,
      );

      expect(entry.pullEvents()).toEqual([
        mocks.GenericSituationLoggedEvent,
        mocks.GenericEmotionLoggedEvent,
        mocks.GenericReactionLoggedEvent,
      ]);
    });
  });

  test("reappraiseEmotion - correct path", async () => {
    spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      entry.reappraiseEmotion(newEmotion, mocks.userId),
    );

    expect(entry.pullEvents()).toEqual([mocks.GenericEmotionReappraisedEvent]);
  });

  test("reappraiseEmotion - Invariants.EmotionCorrespondsToSituation", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, []);

    expect(() => entry.reappraiseEmotion(newEmotion, mocks.userId)).toThrow(
      Emotions.Invariants.EmotionCorrespondsToSituation.error,
    );

    expect(entry.pullEvents()).toEqual([]);
  });

  test("reappraiseEmotion - Invariants.EmotionForReappraisalExists", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent]);

    expect(() => entry.reappraiseEmotion(newEmotion, mocks.userId)).toThrow(
      Emotions.Invariants.EmotionForReappraisalExists.error,
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

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      entry.evaluateReaction(newReaction, mocks.userId),
    );

    expect(entry.pullEvents()).toEqual([mocks.GenericReactionEvaluatedEvent]);
  });

  test("evaluateReaction - Invariants.ReactionCorrespondsToSituationAndEmotion - missing situation and emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, []);

    expect(() => entry.evaluateReaction(newReaction, mocks.userId)).toThrow(
      Emotions.Invariants.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(entry.pullEvents()).toEqual([]);
  });

  test("evaluateReaction - Invariants.ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent]);

    expect(() => entry.evaluateReaction(newReaction, mocks.userId)).toThrow(
      Emotions.Invariants.ReactionCorrespondsToSituationAndEmotion.error,
    );

    expect(entry.pullEvents()).toEqual([]);
  });

  test("evaluateReaction - Invariants.ReactionForEvaluationExists - missing emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    expect(() => entry.evaluateReaction(newReaction, mocks.userId)).toThrow(
      Emotions.Invariants.ReactionForEvaluationExists.error,
    );

    expect(entry.pullEvents()).toEqual([]);
  });

  test("delete - correct path - after situation", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent]);

    await bg.CorrelationStorage.run(mocks.correlationId, () => entry.delete(mocks.userId));

    expect(entry.pullEvents()).toEqual([mocks.GenericEntryDeletedEvent]);
  });

  test("delete - correct path - after emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, () => entry.delete(mocks.userId));

    expect(entry.pullEvents()).toEqual([mocks.GenericEntryDeletedEvent]);
  });

  test("delete - correct path - after reaction", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [
      mocks.GenericSituationLoggedEvent,
      mocks.GenericEmotionLoggedEvent,
      mocks.GenericReactionLoggedEvent,
    ]);

    await bg.CorrelationStorage.run(mocks.correlationId, () => entry.delete(mocks.userId));

    expect(entry.pullEvents()).toEqual([mocks.GenericEntryDeletedEvent]);
  });

  test("delete - EntryHasBenStarted", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, []);

    expect(() => entry.delete(mocks.userId)).toThrow(Emotions.Invariants.EntryHasBenStarted.error);

    expect(entry.pullEvents()).toEqual([]);
  });
});
