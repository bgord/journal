import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Publishing from "+publishing";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class HideShareableLinkDrizzle implements Publishing.Ports.HideShareableLink {
  async hide(id: Publishing.VO.ShareableLinkIdType, userId: Auth.VO.UserIdType): Promise<void> {
    await db
      .update(Schema.shareableLinks)
      .set({ hidden: true })
      .where(
        and(
          eq(Schema.shareableLinks.id, id),
          eq(Schema.shareableLinks.ownerId, userId),
          eq(Schema.shareableLinks.hidden, false),
        ),
      );
  }
}

export const HideShareableLink = new HideShareableLinkDrizzle();
