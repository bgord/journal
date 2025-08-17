import * as tools from "@bgord/tools";
import { and, eq, lte } from "drizzle-orm";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import type { ExpiringShareableLinksPort } from "+publishing/ports";
import * as VO from "+publishing/value-objects";

export class ExpiringShareableLinksDrizzle implements ExpiringShareableLinksPort {
  async listDue(now: tools.TimestampType) {
    const rows = await db
      .select({ id: Schema.shareableLinks.id, revision: Schema.shareableLinks.revision })
      .from(Schema.shareableLinks)
      .where(
        and(
          eq(Schema.shareableLinks.status, VO.ShareableLinkStatusEnum.active),
          lte(Schema.shareableLinks.expiresAt, now),
        ),
      );

    return rows;
  }
}
