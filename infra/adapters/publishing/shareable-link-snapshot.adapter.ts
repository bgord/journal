import * as tools from "@bgord/tools";
import { and, desc, eq, sql } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Publishing from "+publishing";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class ShareableLinkSnapshotDrizzle implements Publishing.Ports.ShareableLinkSnapshotPort {
  async getByUserId(
    userId: Auth.VO.UserIdType,
    timeZoneOffsetMs: tools.DurationMsType,
  ): Promise<Array<Publishing.VO.ShareableLinkSnapshot>> {
    const result: Array<Publishing.VO.ShareableLinkSnapshot> = [];

    const shareableLinks = await db.query.shareableLinks.findMany({
      where: and(eq(Schema.shareableLinks.ownerId, userId), eq(Schema.shareableLinks.hidden, false)),
      orderBy: [
        sql`CASE ${Schema.shareableLinks.status} WHEN ${Publishing.VO.ShareableLinkStatusEnum.active} THEN 0 ELSE 1 END`,
        desc(Schema.shareableLinks.createdAt),
      ],
      limit: 5,
    });

    for (const shareableLink of shareableLinks) {
      const hits = await db.$count(
        Schema.shareableLinkHits,
        and(
          eq(Schema.shareableLinkHits.ownerId, userId),
          eq(Schema.shareableLinkHits.shareableLinkId, shareableLink.id),
        ),
      );

      const uniqueVisitorsResult = await db
        .select({ count: sql`count(distinct ${Schema.shareableLinkHits.visitorId})` })
        .from(Schema.shareableLinkHits)
        .where(eq(Schema.shareableLinkHits.shareableLinkId, shareableLink.id));

      const uniqueVisitors = uniqueVisitorsResult[0]?.count ?? 0;

      result.push({
        ...ShareableLinkSnapshotDrizzle.format(shareableLink, timeZoneOffsetMs),
        hits: tools.IntegerNonNegative.parse(hits),
        uniqueVisitors: tools.IntegerNonNegative.parse(uniqueVisitors),
      });
    }

    return result;
  }

  static format(shareableLink: Schema.SelectShareableLinks, timeZoneOffsetMs: tools.DurationMsType) {
    return {
      ...shareableLink,
      status: shareableLink.status as Publishing.VO.ShareableLinkStatusEnum,
      dateRangeStart: tools.DateFormatters.datetime(shareableLink.dateRangeStart + timeZoneOffsetMs),
      dateRangeEnd: tools.DateFormatters.datetime(shareableLink.dateRangeEnd + timeZoneOffsetMs),
      expiresAt: tools.DateFormatters.datetime(shareableLink.expiresAt + timeZoneOffsetMs),
      updatedAt: tools.DateFormatters.datetime(shareableLink.updatedAt + timeZoneOffsetMs),
    };
  }
}

export const ShareableLinkSnapshot = new ShareableLinkSnapshotDrizzle();
