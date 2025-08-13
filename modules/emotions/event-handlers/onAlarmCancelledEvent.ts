import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onAlarmCancelledEvent = async (event: Emotions.Events.AlarmCancelledEventType) => {
  await db
    .update(Schema.alarms)
    .set({ status: Emotions.VO.AlarmStatusEnum.cancelled })
    .where(eq(Schema.alarms.id, event.payload.alarmId));
};
