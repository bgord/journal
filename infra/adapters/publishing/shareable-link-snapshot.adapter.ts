import * as tools from "@bgord/tools";
import { and, desc, eq, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import type { ShareableLinkSnapshotPort } from "+publishing/ports";
import * as VO from "+publishing/value-objects";

class ShareableLinkSnapshotDrizzle implements ShareableLinkSnapshotPort {
  async getByUserId(userId: Auth.VO.UserIdType, _timeZoneOffsetMs: tools.DurationMsType) {
    const shareableLinks = await db.query.shareableLinks.findMany({
      where: and(eq(Schema.shareableLinks.ownerId, userId), eq(Schema.shareableLinks.hidden, false)),
      orderBy: [
        sql`CASE ${Schema.shareableLinks.status} WHEN '${VO.ShareableLinkStatusEnum.active}' THEN 0 ELSE 1 END`,
        desc(Schema.shareableLinks.createdAt),
      ],
    });

    return shareableLinks.map(ShareableLinkSnapshotDrizzle.format);
  }

  static format(shareableLink: Schema.SelectShareableLinks) {
    return {
      ...shareableLink,
      status: shareableLink.status as VO.ShareableLinkStatusEnum,
      dateRangeStart: tools.Timestamp.parse(shareableLink.dateRangeStart),
      dateRangeEnd: tools.Timestamp.parse(shareableLink.dateRangeEnd),
      expiresAt: tools.Timestamp.parse(shareableLink.expiresAt),
      updatedAt: tools.Timestamp.parse(shareableLink.updatedAt),
    };
  }
}

export const ShareableLinkSnapshot = new ShareableLinkSnapshotDrizzle();
