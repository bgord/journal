import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import * as Emotions from "+emotions";
import * as History from "+history";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onSituationLoggedEvent =
  (HistoryWriter: History.Services.HistoryWriterPort) =>
  async (event: Emotions.Events.SituationLoggedEventType) => {
    await db.insert(Schema.entries).values({
      id: event.payload.entryId,
      status: Emotions.VO.EntryStatusEnum.actionable,
      startedAt: event.createdAt,
      situationKind: event.payload.kind,
      situationDescription: event.payload.description,
      situationLocation: event.payload.location,
      revision: event.revision,
      language: event.payload.language,
      weekIsoId: tools.Week.fromTimestamp(event.createdAt).toIsoId(),
      userId: event.payload.userId,
      origin: event.payload.origin,
    });

    await HistoryWriter.populate({
      operation: "entry.situation.logged",
      subject: event.payload.entryId,
      payload: {
        kind: event.payload.kind,
        description: event.payload.description,
        location: event.payload.location,
      },
    });

    const isTimeCapsule = await Emotions.Repos.TimeCapsuleEntryRepository.getById(event.payload.entryId);

    if (isTimeCapsule) {
      await db
        .update(Schema.timeCapsuleEntries)
        .set({ status: Emotions.VO.TimeCapsuleEntryStatusEnum.published })
        .where(eq(Schema.timeCapsuleEntries.id, event.payload.entryId));
    }
  };
