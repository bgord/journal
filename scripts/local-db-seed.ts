import * as bg from "@bgord/bun";
import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import _ from "lodash";
import * as Auth from "+auth";
import * as Emotions from "+emotions";
import * as Publishing from "+publishing";
import * as Adapters from "+infra/adapters";
import { Clock } from "+infra/adapters/clock.adapter";
import { auth } from "+infra/auth";
import { CommandBus } from "+infra/command-bus";
import { db } from "+infra/db";
import { EventBus } from "+infra/event-bus";
import { EventStore } from "+infra/event-store";
import * as Schema from "+infra/schema";
import * as mocks from "../tests/mocks";

import "+infra/register-event-handlers";
import "+infra/register-command-handlers";

const deps = { IdProvider: Adapters.IdProvider, Clock: Adapters.Clock };

const EventHandler = new bg.EventHandler(Adapters.logger);
const currentMs = Clock.nowMs();

const situationDescriptions = [
  "I missed an important appointment because I confused the time zones while traveling, which made me feel embarrassed and deeply irresponsible",
  "Caught in traffic swearing about other drivers",
  "Was put on the spot during a meeting with executives",
  "Overslept and missed a scheduled appointment",
  "Walked into a room and forgot why I was there",
  "Chat with a friend about a difficult situation",
  "Morning jog with a knee pain",
  "Phone battery died during a crucial navigation moment",
  "Was interrupted multiple times during focused work",
  "Woke up feeling inexplicably anxious",
  "Family dinner with people I do not like",
  "Had to deal with a difficult customer at work",
  "While trying to enjoy my evening, I was constantly interrupted by work notifications demanding urgent attention, making me feel anxious and powerless",
  "Lunch break ruined by noisy coworkers in the cafeteria",
  "Received critical feedback in front of the whole team",
  "Work presentation about a boring topic",
  "A friend unexpectedly opened up about a traumatic event during a casual meetup, and I felt completely unequipped to respond in a supportive way",
  "Got blamed for something I didn’t do",
  "After a long day, I found my apartment flooded due to a broken pipe, and had no immediate help available, triggering a full stress response",
  "I was suddenly asked to explain a complex topic in front of unfamiliar executives without any preparation, leading to visible stress and hesitation",
];
const situationKinds = Object.keys(Emotions.VO.SituationKindOptions);
const situationLocations = ["Home", "Office", "Park", "Restaurant", "Car"];

const emotionLabels = Object.keys(Emotions.VO.GenevaWheelEmotion);

const reactionDescriptions = [
  "Took a short walk",
  "Visualized a safe place",
  "Deep breathing",
  "I stepped outside, put my phone away, and focused entirely on slow, intentional breaths while observing the sky and surroundings to ground myself",
  "Used an app-guided mindfulness exercise",
  "Talked it out",
  "Drank a glass of cold water",
  "Sat quietly and let the feelings pass",
  "Listened to calming music",
  "Repeated a calming phrase several times",
  "Wrote in journal",
  "Counted to ten",
  "I closed my laptop, turned off all notifications, and gave myself fifteen minutes to simply breathe and acknowledge how overwhelmed I was feeling",
  "Stepped outside to get some fresh air",
  "Sent a message to a friend",
  "Screamed into a pillow",
  "I made tea, wrapped myself in a blanket, and gave myself permission to feel sad without rushing to fix anything or force productivity",
  "I walked for over an hour with no destination, letting my mind wander until the emotional intensity gradually started to dissolve",
  "I poured out all of my thoughts into my journal without censoring myself, which helped me process the chaos I was feeling internally with clarity",
  "Did a body scan to relax",
];

const reactionTypes = Object.keys(Emotions.VO.GrossEmotionRegulationStrategy);

(async function main() {
  const correlationId = Adapters.IdProvider.generate();

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

    await db.delete(Schema.shareableLinks);
    console.log("[x] Cleared shareableLinks");

    await db.delete(Schema.timeCapsuleEntries);
    console.log("[x] Cleared timeCapsuleEntries");

    await db.delete(Schema.aiUsageCounters);
    console.log("[x] Cleared aiUsageCounters");

    await db.delete(Schema.history);
    console.log("[x] Cleared history");

    await db.delete(Schema.userPreferences);
    console.log("[x] Cleared userPreferences");

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

        await db.update(Schema.users).set({ emailVerified: true }).where(eq(Schema.users.email, user.email));

        const event = Auth.Events.AccountCreatedEvent.parse({
          ...bg.createEventEnvelope(`account_${result.user.id}`, deps),
          name: Auth.Events.ACCOUNT_CREATED_EVENT,
          payload: { userId: result.user.id, timestamp: currentMs },
        } satisfies Auth.Events.AccountCreatedEventType);

        await EventStore.save([event]);

        console.log(`[✓] User ${index + 1} created`);

        return result;
      }),
    );

    const inactivityDetections = [
      new Emotions.VO.AlarmDetection(
        Emotions.VO.AlarmTrigger.parse({
          type: Emotions.VO.AlarmTriggerEnum.inactivity,
          inactivityDays: 7,
          lastEntryTimestamp: tools.Time.Now(currentMs).Minus(tools.Time.Days(10)).ms,
        }),
        Emotions.VO.AlarmNameOption.INACTIVITY_ALARM,
      ),
    ];

    for (const [index, detection] of Object.entries(inactivityDetections)) {
      const alarmId = Adapters.IdProvider.generate();
      const alarm = Emotions.Aggregates.Alarm.generate(
        alarmId,
        detection,
        users[0]?.user.id as Auth.VO.UserIdType,
        deps,
      );

      await EventStore.save(alarm.pullEvents());

      console.log(`[✓] Alarm ${Number(index) + 1} created`);
    }

    for (const counter of _.range(0, 20)) {
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
        Adapters.IdProvider.generate(),
        situation,
        emotion,
        reaction,
        users[0]?.user.id as Auth.VO.UserIdType,
        Emotions.VO.EntryOriginOption.web,
        deps,
      );

      await EventStore.save(entry.pullEvents());

      console.log(`[✓] Entry ${counter + 1} created`);
    }

    const ScheduleTimeCapsuleEntryCommand = Emotions.Commands.ScheduleTimeCapsuleEntryCommand.parse({
      ...bg.createCommandEnvelope(deps),
      name: Emotions.Commands.SCHEDULE_TIME_CAPSULE_ENTRY_COMMAND,
      payload: {
        entryId: Adapters.IdProvider.generate(),
        situation: new Emotions.Entities.Situation(
          new Emotions.VO.SituationDescription(situationDescriptions[0] as string),
          new Emotions.VO.SituationLocation(situationLocations[0] as string),
          new Emotions.VO.SituationKind(situationKinds[0] as Emotions.VO.SituationKindOptions),
        ),
        emotion: new Emotions.Entities.Emotion(
          new Emotions.VO.EmotionLabel(emotionLabels[0] as Emotions.VO.GenevaWheelEmotion),
          new Emotions.VO.EmotionIntensity(1),
        ),
        reaction: new Emotions.Entities.Reaction(
          new Emotions.VO.ReactionDescription(reactionDescriptions[0] as string),
          new Emotions.VO.ReactionType(reactionTypes[0] as Emotions.VO.GrossEmotionRegulationStrategy),
          new Emotions.VO.ReactionEffectiveness(1),
        ),
        userId: users[0]?.user.id as Auth.VO.UserIdType,
        scheduledAt: currentMs,
        scheduledFor: tools.Timestamp.parse(tools.Time.Now(currentMs).Add(tools.Time.Minutes(5)).ms),
      },
    } satisfies Emotions.Commands.ScheduleTimeCapsuleEntryCommandType);

    await CommandBus.emit(ScheduleTimeCapsuleEntryCommand.name, ScheduleTimeCapsuleEntryCommand);

    console.log("[✓] Time capsule entry scheduled");

    await new Emotions.Policies.WeeklyReviewScheduler({
      EventBus,
      EventHandler,
      CommandBus,
      IdProvider: Adapters.IdProvider,
      Clock: Adapters.Clock,
      UserDirectory: Adapters.Auth.UserDirectory,
    }).onHourHasPassedEvent(mocks.GenericHourHasPassedMondayUtc18Event);

    console.log("[✓] Weekly review scheduled");

    const shareableLink = Publishing.Aggregates.ShareableLink.create(
      Adapters.IdProvider.generate(),
      "entries",
      new tools.DateRange(
        tools.Time.Now(currentMs).Minus(tools.Time.Days(7)).ms as tools.TimestampType,
        Date.now() as tools.TimestampType,
      ),
      tools.Time.Days(3),
      users[0]?.user.id as Auth.VO.UserIdType,
      deps,
    );

    await EventStore.save(shareableLink.pullEvents());

    console.log("[✓] Shareable Link created");

    process.exit(0);
  });
})();
