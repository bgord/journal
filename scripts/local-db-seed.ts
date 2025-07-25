import * as Emotions from "+emotions";
import { auth } from "+infra/auth";
import { db } from "+infra/db";
import { EventStore } from "+infra/event-store";
import { SupportedLanguages } from "+infra/i18n";
import * as Schema from "+infra/schema";
import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
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
  const correlationId = crypto.randomUUID();

  await bg.CorrelationStorage.run(correlationId, async () => {
    await db.delete(Schema.events);
    console.log("[x] Cleared events");

    await db.delete(Schema.alarms);
    console.log("[x] Cleared alarms");

    await db.delete(Schema.entries);
    console.log("[x] Cleared entries");

    await db.delete(Schema.patternDetections);
    console.log("[x] Cleared patternDetections");

    await db.delete(Schema.weeklyReviews);
    console.log("[x] Cleared weeklyReviews");

    await db.delete(Schema.accounts);
    console.log("[x] Cleared accounts");

    await db.delete(Schema.users);
    console.log("[x] Cleared users");

    await db.delete(Schema.sessions);
    console.log("[x] Cleared sessions");

    await db.delete(Schema.verifications);
    console.log("[x] Cleared verifications");

    const users = await Promise.all(
      [
        { email: "admin@example.com", password: "1234567890" },
        { email: "user@example.com", password: "1234567890" },
      ].map(async (user, index) => {
        const result = await auth.api.signUpEmail({
          body: { email: user.email, name: user.email, password: user.password },
        });

        console.log(`[✓] User ${index + 1} created`);

        return result;
      }),
    );

    const inactivityDetections = [
      new Emotions.VO.AlarmDetection(
        Emotions.VO.AlarmTrigger.parse({
          type: Emotions.VO.AlarmTriggerEnum.inactivity,
          inactivityDays: 7,
          lastEntryTimestamp: tools.Time.Now().Minus(tools.Time.Days(10)).ms,
        }),
        Emotions.VO.AlarmNameOption.INACTIVITY_ALARM,
      ),
      new Emotions.VO.AlarmDetection(
        Emotions.VO.AlarmTrigger.parse({
          type: Emotions.VO.AlarmTriggerEnum.inactivity,
          inactivityDays: 7,
          lastEntryTimestamp: tools.Time.Now().Minus(tools.Time.Days(20)).ms,
        }),
        Emotions.VO.AlarmNameOption.INACTIVITY_ALARM,
      ),
    ];

    for (const [index, detection] of Object.entries(inactivityDetections)) {
      await Emotions.Services.AlarmFactory.create(detection, users[0]!.user.id);
      console.log(`[✓] Alarm ${Number(index) + 1} created`);
    }

    for (const counter of _.range(0, 10)) {
      const situation = new Emotions.Entities.Situation(
        new Emotions.VO.SituationDescription(
          situationDescriptions[counter % situationDescriptions.length] as string,
        ),
        new Emotions.VO.SituationLocation(situationLocations[counter % situationLocations.length] as string),
        new Emotions.VO.SituationKind(
          situationKinds[counter % situationKinds.length] as Emotions.VO.SituationKindOptions,
        ),
      );

      const emotion = new Emotions.Entities.Emotion(
        new Emotions.VO.EmotionLabel(
          emotionLabels[counter % emotionLabels.length] as Emotions.VO.GenevaWheelEmotion,
        ),
        new Emotions.VO.EmotionIntensity((counter % 5) + 1),
      );

      const reaction = new Emotions.Entities.Reaction(
        new Emotions.VO.ReactionDescription(
          reactionDescriptions[counter % reactionDescriptions.length] as string,
        ),
        new Emotions.VO.ReactionType(
          reactionTypes[counter % reactionTypes.length] as Emotions.VO.GrossEmotionRegulationStrategy,
        ),
        new Emotions.VO.ReactionEffectiveness((counter % 5) + 1),
      );

      const entry = Emotions.Aggregates.Entry.log(
        crypto.randomUUID(),
        situation,
        emotion,
        reaction,
        SupportedLanguages.en,
        users[0]!.user.id,
      );

      await EventStore.save(entry.pullEvents());

      console.log(`[✓] Entry ${counter + 1} created`);
    }

    await Emotions.Services.WeeklyReviewScheduler.process();

    console.log("[✓] Weekly review scheduled");

    process.exit(0);
  });
})();
