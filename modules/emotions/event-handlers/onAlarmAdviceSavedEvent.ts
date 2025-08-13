import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onAlarmAdviceSavedEvent = async (event: Emotions.Events.AlarmAdviceSavedEventType) => {
  await db
    .update(Schema.alarms)
    .set({
      advice: event.payload.advice,
      status: Emotions.VO.AlarmStatusEnum.advice_saved,
    })
    .where(eq(Schema.alarms.id, event.payload.alarmId));
};
