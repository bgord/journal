import * as tools from "@bgord/tools";
import { and, desc, eq, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import type { ShareableLinkSnapshotPort } from "+publishing/ports";
import * as VO from "+publishing/value-objects";

class ShareableLinkSnapshotDrizzle implements ShareableLinkSnapshotPort {
  async getByUserId(
    userId: Auth.VO.UserIdType,
    timeZoneOffsetMs: tools.DurationMsType,
  ): Promise<VO.ShareableLinkSnapshot[]> {
    const shareableLinks = await db.query.shareableLinks.findMany({
      where: and(eq(Schema.shareableLinks.ownerId, userId), eq(Schema.shareableLinks.hidden, false)),
      orderBy: [
        sql`CASE ${Schema.shareableLinks.status} WHEN ${VO.ShareableLinkStatusEnum.active} THEN 0 ELSE 1 END`,
        desc(Schema.shareableLinks.createdAt),
      ],
    });

    return shareableLinks.map((shareableLink) =>
      ShareableLinkSnapshotDrizzle.format(shareableLink, timeZoneOffsetMs),
    );
  }

  static format(shareableLink: Schema.SelectShareableLinks, timeZoneOffsetMs: tools.DurationMsType) {
    return {
      ...shareableLink,
      status: shareableLink.status as VO.ShareableLinkStatusEnum,
      dateRangeStart: tools.DateFormatters.datetime(shareableLink.dateRangeStart + timeZoneOffsetMs),
      dateRangeEnd: tools.DateFormatters.datetime(shareableLink.dateRangeEnd + timeZoneOffsetMs),
      expiresAt: tools.DateFormatters.datetime(shareableLink.expiresAt + timeZoneOffsetMs),
      updatedAt: tools.DateFormatters.datetime(shareableLink.updatedAt + timeZoneOffsetMs),
    };
  }
}

export const ShareableLinkSnapshot = new ShareableLinkSnapshotDrizzle();
