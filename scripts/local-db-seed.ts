import * as Emotions from "+emotions";
import { db } from "+infra/db";
import { EventStore } from "+infra/event-store";
import * as Schema from "+infra/schema";
import * as bg from "@bgord/bun";
import _ from "lodash";

import "+infra/register-event-handlers";
import "+infra/register-command-handlers";

const situationDescriptions = [
  "Chat with a friend about a difficult situation",
  "Work presentation about a boring topic",
  "Morning jog with a knee pain",
  "Family dinner with people I do not like",
  "Caught in traffic swearing about other drivers",
];
const situationKinds = Object.keys(Emotions.VO.SituationKindOptions);
const situationLocations = ["Home", "Office", "Park", "Restaurant", "Car"];

const emotionLabels = Object.keys(Emotions.VO.GenevaWheelEmotion);

const reactionDescriptions = [
  "Deep breathing",
  "Counted to ten",
  "Talked it out",
  "Took a short walk",
  "Wrote in journal",
];

const reactionTypes = Object.keys(Emotions.VO.GrossEmotionRegulationStrategy);

(async function main() {
  const correlationId = bg.NewUUID.generate();

  await bg.CorrelationStorage.run(correlationId, async () => {
    await db.delete(Schema.events);
    console.log("[x] Cleared events");

    await db.delete(Schema.alarms);
    console.log("[x] Cleared alarms");

    await db.delete(Schema.emotionJournalEntries);
    console.log("[x] Cleared emotion‐journal entries");

    for (const _counter of _.range(1, 10)) {
      const situation = new Emotions.Entities.Situation(
        new Emotions.VO.SituationDescription(_.sample(situationDescriptions) as string),
        new Emotions.VO.SituationLocation(_.sample(situationLocations) as string),
        new Emotions.VO.SituationKind(_.sample(situationKinds) as Emotions.VO.SituationKindOptions),
      );

      const entry = Emotions.Aggregates.EmotionJournalEntry.create(bg.NewUUID.generate());
      await entry.logSituation(situation);

      const emotion = new Emotions.Entities.Emotion(
        new Emotions.VO.EmotionLabel(_.sample(emotionLabels) as Emotions.VO.GenevaWheelEmotion),
        new Emotions.VO.EmotionIntensity(_.random(1, 5)),
      );

      await entry.logEmotion(emotion);

      const reaction = new Emotions.Entities.Reaction(
        new Emotions.VO.ReactionDescription(_.sample(reactionDescriptions) as string),
        new Emotions.VO.ReactionType(_.sample(reactionTypes) as Emotions.VO.GrossEmotionRegulationStrategy),
        new Emotions.VO.ReactionEffectiveness(_.random(1, 5)),
      );

      await entry.logReaction(reaction);

      await EventStore.save(entry.pullEvents());

      console.log(`[✓] Entry ${_counter} created`);
    }

    process.exit(0);
  });
})();
