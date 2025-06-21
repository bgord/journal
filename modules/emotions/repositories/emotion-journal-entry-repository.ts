import * as infra from "../../../infra";
import * as Events from "../events";
import * as VO from "../value-objects";

export class EmotionJournalEntryRepository {
  static async logSituation(event: Events.SituationLoggedEventType) {
    await infra.db.insert(infra.Schema.emotionJournalEntries).values({
      id: event.payload.id,
      status: VO.EmotionJournalEntryStatusEnum.actionable,
      startedAt: event.createdAt,
      situationKind: event.payload.kind,
      situationDescription: event.payload.description,
      situationLocation: event.payload.location,
    });
  }
}
