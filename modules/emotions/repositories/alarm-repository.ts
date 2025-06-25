import { db } from "../../../infra/db";
import * as Schema from "../../../infra/schema";
import type * as Events from "../events";
import * as VO from "../value-objects";

export class AlarmRepository {
  static async generate(event: Events.AlarmGeneratedEventType) {
    await db.insert(Schema.alarms).values({
      id: event.payload.alarmId,
      name: event.payload.alarmName,
      emotionJournalEntryId: event.payload.emotionJournalEntryId,
      status: VO.AlarmStatusEnum.generated,
      generatedAt: event.createdAt,
    });
  }
}
