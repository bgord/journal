import type * as tools from "@bgord/tools";
import { and, eq, lte } from "drizzle-orm";
import * as Publishing from "+publishing";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ExpiringShareableLinksDrizzle implements Publishing.Ports.ExpiringShareableLinksPort {
  async listDue(now: tools.TimestampValueType) {
    const rows = await db
      .select({ id: Schema.shareableLinks.id, revision: Schema.shareableLinks.revision })
      .from(Schema.shareableLinks)
      .where(
        and(
          eq(Schema.shareableLinks.status, Publishing.VO.ShareableLinkStatusEnum.active),
          lte(Schema.shareableLinks.expiresAt, now),
        ),
      );

    return rows;
  }
}

export const ExpiringShareableLinks = new ExpiringShareableLinksDrizzle();
