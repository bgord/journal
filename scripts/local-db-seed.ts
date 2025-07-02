import * as tools from "@bgord/tools";
import _ from "lodash";
import * as infra from "../infra";
import type { SelectEmotionJournalEntries } from "../infra/schema";
import * as Emotions from "../modules/emotions";

(async function main() {
  const entries: SelectEmotionJournalEntries[] = Array.from({ length: 10 }).map(() => {
    return {
      id: crypto.randomUUID(),
      startedAt: _.random(Date.now() - tools.Time.Days(7).ms, Date.now()),
      finishedAt: Date.now(),
      situationDescription: _.sample([
        "Chat with a friend",
        "Work presentation",
        "Morning jog",
        "Family dinner",
        "Caught in traffic",
      ]),
      situationLocation: _.sample(["Home", "Office", "Park", "Restaurant", "Car"]),
      situationKind: _.sample(
        Object.values(Emotions.VO.SituationKindOptions),
      ) as Emotions.VO.SituationKindType,
      emotionLabel: _.sample(Object.values(Emotions.VO.GenevaWheelEmotion)) as Emotions.VO.GenevaWheelEmotion,
      emotionIntensity: _.random(1, 5),
      reactionDescription: _.sample([
        "Deep breathing",
        "Counted to ten",
        "Talked it out",
        "Took a short walk",
        "Wrote in journal",
      ]),
      reactionType: _.sample(
        Emotions.VO.GrossEmotionRegulationStrategy,
      ) as Emotions.VO.GrossEmotionRegulationStrategy,
      reactionEffectiveness: _.random(1, 5),
      status: _.sample(
        Emotions.VO.EmotionJournalEntryStatusEnum,
      ) as Emotions.VO.EmotionJournalEntryStatusEnum,
    };
  });

  await infra.db.insert(infra.Schema.emotionJournalEntries).values(entries);
  console.log("✅ 10 emotion‐journal entries inserted");
  process.exit(0);
})();
