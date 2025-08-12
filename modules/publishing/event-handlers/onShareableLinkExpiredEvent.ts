import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as Publishing from "+publishing";
import { eq } from "drizzle-orm";

export const onShareableLinkExpiredEvent = async (event: Publishing.Events.ShareableLinkExpiredEventType) => {
  await db
    .update(Schema.shareableLinks)
    .set({ updatedAt: event.createdAt, status: Publishing.VO.ShareableLinkStatusEnum.expired })
    .where(eq(Schema.shareableLinks.id, event.payload.shareableLinkId));
};
