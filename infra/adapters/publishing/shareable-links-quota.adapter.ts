import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Publishing from "+publishing";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ShareableLinksQuotaQueryDrizzle implements Publishing.Queries.ShareableLinksQuotaQuery {
  async execute(ownerId: Auth.VO.UserIdType) {
    return {
      count: await db.$count(
        Schema.shareableLinks,
        and(
          eq(Schema.shareableLinks.ownerId, ownerId),
          eq(Schema.shareableLinks.status, Publishing.VO.ShareableLinkStatusEnum.active),
        ),
      ),
    };
  }
}

export const ShareableLinksQuotaQuery = new ShareableLinksQuotaQueryDrizzle();
