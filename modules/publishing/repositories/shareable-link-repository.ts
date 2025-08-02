import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as Events from "+publishing/events";
import * as VO from "+publishing/value-objects";
import { and, eq, lte } from "drizzle-orm";

export class ShareableLinkRepository {
  static async listNearExpiration(): Promise<Schema.SelectShareableLinks[]> {
    return db.query.shareableLinks.findMany({
      where: and(
        eq(Schema.shareableLinks.status, VO.ShareableLinkStatusEnum.active),
        lte(Schema.shareableLinks.expiresAt, Date.now()),
      ),
    });
  }

  static async create(event: Events.ShareableLinkCreatedEventType) {
    await db.insert(Schema.shareableLinks).values({
      id: event.payload.shareableLinkId,
      createdAt: event.payload.createdAt,
      updatedAt: event.payload.createdAt,
      status: VO.ShareableLinkStatusEnum.active,
      revision: event.revision,
      ownerId: event.payload.ownerId,
      publicationSpecification: event.payload.publicationSpecification,
      dateRangeStart: event.payload.dateRangeStart,
      dateRangeEnd: event.payload.dateRangeEnd,
      durationMs: event.payload.durationMs,
      expiresAt: event.payload.createdAt + event.payload.durationMs,
    });
  }

  static async expire(event: Events.ShareableLinkExpiredEventType) {
    await db
      .update(Schema.shareableLinks)
      .set({ updatedAt: event.createdAt, status: VO.ShareableLinkStatusEnum.expired })
      .where(eq(Schema.shareableLinks.id, event.payload.shareableLinkId));
  }

  static async revoke(event: Events.ShareableLinkRevokedEventType) {
    await db
      .update(Schema.shareableLinks)
      .set({ updatedAt: event.createdAt, status: VO.ShareableLinkStatusEnum.revoked })
      .where(eq(Schema.shareableLinks.id, event.payload.shareableLinkId));
  }
}
