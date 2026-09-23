import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const newReaction = new Emotions.Entities.Reaction(
  new Emotions.VO.ReactionDescription("Went to bed"),
  new Emotions.VO.ReactionType(Emotions.VO.GrossEmotionRegulationStrategy.avoidance),
  new Emotions.VO.ReactionEffectiveness(2),
);

describe("Entry.evaluateReaction", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const entry = Emotions.Aggregates.Entry.build(
      mocks.entryId,
      [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent, mocks.GenericReactionLoggedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      entry.evaluateReaction(newReaction, mocks.userId),
    );

    expect(entry.pullEvents()).toEqual([mocks.GenericReactionEvaluatedEvent]);
    expect(entry.toSnapshot()).toEqual(
      expect.objectContaining({
        reaction: new Emotions.Entities.Reaction(
          new Emotions.VO.ReactionDescription(mocks.GenericReactionEvaluatedEvent.payload.description),
          new Emotions.VO.ReactionType(mocks.GenericReactionEvaluatedEvent.payload.type),
          new Emotions.VO.ReactionEffectiveness(mocks.GenericReactionEvaluatedEvent.payload.effectiveness),
        ),
      }),
    );
  });

  test("ReactionCorrespondsToSituationAndEmotion - missing situation and emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [], deps);

    expect(() => entry.evaluateReaction(newReaction, mocks.userId)).toThrow(
      Emotions.Invariants.ReactionCorrespondsToSituationAndEmotion.error,
    );
    expect(entry.pullEvents()).toEqual([]);
  });

  test("ReactionCorrespondsToSituationAndEmotion - missing situation", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericEmotionLoggedEvent], deps);

    expect(() => entry.evaluateReaction(newReaction, mocks.userId)).toThrow(
      Emotions.Invariants.ReactionCorrespondsToSituationAndEmotion.error,
    );
    expect(entry.pullEvents()).toEqual([]);
  });

  test("ReactionCorrespondsToSituationAndEmotion - missing emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent], deps);

    expect(() => entry.evaluateReaction(newReaction, mocks.userId)).toThrow(
      Emotions.Invariants.ReactionCorrespondsToSituationAndEmotion.error,
    );
    expect(entry.pullEvents()).toEqual([]);
  });

  test("ReactionForEvaluationExists - missing emotion", async () => {
    const entry = Emotions.Aggregates.Entry.build(
      mocks.entryId,
      [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent],
      deps,
    );

    expect(() => entry.evaluateReaction(newReaction, mocks.userId)).toThrow(
      Emotions.Invariants.ReactionForEvaluationExists.error,
    );
    expect(entry.pullEvents()).toEqual([]);
  });
});
