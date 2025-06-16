import { describe, expect, test } from "bun:test";
import * as bg from "@bgord/bun";

import * as Emotions from "../modules/emotions";

describe("EmotionJournalEntry", () => {
  test("build new aggregate", () => {
    const id = bg.NewUUID.generate();

    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    expect(emotionJournalEntry.pullEvents()).toEqual([]);
  });

  test("logSituation - correct path", () => {
    const id = bg.NewUUID.generate();

    const situation = new Emotions.Entities.Situation(
      new Emotions.VO.SituationDescription("I finished a project"),
      new Emotions.VO.SituationLocation("work"),
      new Emotions.VO.SituationKind(
        Emotions.VO.SituationKindOptions.achievement,
      ),
    );

    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    emotionJournalEntry.logSituation(situation);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      {
        type: "situation.logged",
        situation: {
          description: "I finished a project",
          id,
          kind: Emotions.VO.SituationKindOptions.achievement,
          location: "work",
        },
      },
    ]);
  });

  test("logSituation - applied only once", () => {
    const id = bg.NewUUID.generate();

    const situation = new Emotions.Entities.Situation(
      new Emotions.VO.SituationDescription("I finished a project"),
      new Emotions.VO.SituationLocation("work"),
      new Emotions.VO.SituationKind(
        Emotions.VO.SituationKindOptions.achievement,
      ),
    );

    const emotionJournalEntry = Emotions.Aggregates.EmotionJournalEntry.build(
      id,
      [],
    );

    emotionJournalEntry.logSituation(situation);

    expect(emotionJournalEntry.pullEvents()).toEqual([
      {
        type: "situation.logged",
        situation: {
          description: "I finished a project",
          id,
          kind: Emotions.VO.SituationKindOptions.achievement,
          location: "work",
        },
      },
    ]);

    expect(() => emotionJournalEntry.logSituation(situation)).toThrow(
      "Situation already logged for this entry.",
    );
  });
});
