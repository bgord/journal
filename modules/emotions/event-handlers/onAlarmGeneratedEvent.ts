import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as tools from "@bgord/tools";

export const onAlarmGeneratedEvent = async (event: Emotions.Events.AlarmGeneratedEventType) => {
  if (event.payload.trigger.type === Emotions.VO.AlarmTriggerEnum.entry) {
    const entry = await Emotions.Repos.EntryRepository.getByIdRaw(event.payload.trigger.entryId);

    await db.insert(Schema.alarms).values({
      id: event.payload.alarmId,
      name: event.payload.alarmName,
      entryId: event.payload.trigger.entryId,
      status: Emotions.VO.AlarmStatusEnum.generated,
      generatedAt: event.createdAt,
      emotionLabel: entry?.emotionLabel,
      emotionIntensity: entry?.emotionIntensity,
      inactivityDays: undefined,
      lastEntryTimestamp: undefined,
      userId: event.payload.userId,
      weekIsoId: tools.Week.fromTimestamp(event.createdAt).toIsoId(),
    });
  }

  if (event.payload.trigger.type === Emotions.VO.AlarmTriggerEnum.inactivity) {
    await db.insert(Schema.alarms).values({
      id: event.payload.alarmId,
      name: event.payload.alarmName,
      entryId: undefined,
      status: Emotions.VO.AlarmStatusEnum.generated,
      generatedAt: event.createdAt,
      emotionLabel: undefined,
      emotionIntensity: undefined,
      inactivityDays: event.payload.trigger.inactivityDays,
      lastEntryTimestamp: event.payload.trigger.lastEntryTimestamp,
      userId: event.payload.userId,
      weekIsoId: tools.Week.fromTimestamp(event.createdAt).toIsoId(),
    });
  }
};
