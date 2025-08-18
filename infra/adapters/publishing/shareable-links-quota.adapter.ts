import { and, eq } from "drizzle-orm";
import * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import type { ShareableLinksQuotaQuery } from "+publishing/queries";
import * as VO from "+publishing/value-objects";

class ShareableLinksQuotaDrizzle implements ShareableLinksQuotaQuery {
  async execute(ownerId: Auth.VO.UserIdType) {
    return {
      count: await db.$count(
        Schema.shareableLinks,
        and(
          eq(Schema.shareableLinks.ownerId, ownerId),
          eq(Schema.shareableLinks.status, VO.ShareableLinkStatusEnum.active),
        ),
      ),
    };
  }
}

export const ShareableLinksQuota = new ShareableLinksQuotaDrizzle();
