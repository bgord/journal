import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const situation = new Emotions.Entities.Situation(
  new Emotions.VO.SituationDescription("I finished a project"),
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

describe("Entry.log", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);

    await bg.CorrelationStorage.run(mocks.correlationId, () => {
      const entry = Emotions.Aggregates.Entry.log(
        mocks.entryId,
        situation,
        emotion,
        reaction,
        mocks.userId,
        Emotions.VO.EntryOriginOption.web,
        deps,
      );

      expect(entry.pullEvents()).toEqual([
        mocks.GenericSituationLoggedEvent,
        mocks.GenericEmotionLoggedEvent,
        mocks.GenericReactionLoggedEvent,
      ]);
    });
  });
});
