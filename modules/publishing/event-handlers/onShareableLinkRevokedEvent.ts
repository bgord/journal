import { eq } from "drizzle-orm";
import * as Publishing from "+publishing";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export const onShareableLinkRevokedEvent = async (event: Publishing.Events.ShareableLinkRevokedEventType) => {
  await db
    .update(Schema.shareableLinks)
    .set({ updatedAt: event.createdAt, status: Publishing.VO.ShareableLinkStatusEnum.revoked })
    .where(eq(Schema.shareableLinks.id, event.payload.shareableLinkId));
};
