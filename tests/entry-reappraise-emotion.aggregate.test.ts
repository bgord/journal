import { describe, expect, spyOn, test } from "bun:test";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import * as Emotions from "+emotions";
import { bootstrap } from "+infra/bootstrap";
import * as mocks from "./mocks";

const newEmotion = new Emotions.Entities.Emotion(
  new Emotions.VO.EmotionLabel(Emotions.VO.GenevaWheelEmotion.joy),
  new Emotions.VO.EmotionIntensity(3),
);

describe("Entry.reappraiseEmotion", async () => {
  const di = await bootstrap();
  const deps = { ...di.Adapters.System, ...di.Tools };

  test("happy path", async () => {
    using _ = spyOn(tools.Revision.prototype, "next").mockImplementation(() => mocks.revision);
    const entry = Emotions.Aggregates.Entry.build(
      mocks.entryId,
      [mocks.GenericSituationLoggedEvent, mocks.GenericEmotionLoggedEvent],
      deps,
    );

    await bg.CorrelationStorage.run(mocks.correlationId, () =>
      entry.reappraiseEmotion(newEmotion, mocks.userId),
    );

    expect(entry.pullEvents()).toEqual([mocks.GenericEmotionReappraisedEvent]);
    expect(entry.toSnapshot()).toEqual(
      expect.objectContaining({
        emotion: new Emotions.Entities.Emotion(
          new Emotions.VO.EmotionLabel(mocks.GenericEmotionReappraisedEvent.payload.newLabel),
          new Emotions.VO.EmotionIntensity(mocks.GenericEmotionReappraisedEvent.payload.newIntensity),
        ),
      }),
    );
  });

  test("EmotionCorrespondsToSituation", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [], deps);

    expect(() => entry.reappraiseEmotion(newEmotion, mocks.userId)).toThrow(
      Emotions.Invariants.EmotionCorrespondsToSituation.error,
    );
    expect(entry.pullEvents()).toEqual([]);
  });

  test("EmotionForReappraisalExists", async () => {
    const entry = Emotions.Aggregates.Entry.build(mocks.entryId, [mocks.GenericSituationLoggedEvent], deps);

    expect(() => entry.reappraiseEmotion(newEmotion, mocks.userId)).toThrow(
      Emotions.Invariants.EmotionForReappraisalExists.error,
    );
    expect(entry.pullEvents()).toEqual([]);
  });
});
