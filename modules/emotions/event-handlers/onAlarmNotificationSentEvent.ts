import * as Emotions from "+emotions";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { eq } from "drizzle-orm";

export const onAlarmNotificationSentEvent = async (event: Emotions.Events.AlarmNotificationSentEventType) => {
  await db
    .update(Schema.alarms)
    .set({ status: Emotions.VO.AlarmStatusEnum.notification_sent })
    .where(eq(Schema.alarms.id, event.payload.alarmId));
};
