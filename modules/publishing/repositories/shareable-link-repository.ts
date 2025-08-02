import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as VO from "+publishing/value-objects";
import { and, eq, lte } from "drizzle-orm";

export class ShareableLinkRepository {
  static async listNearExpiration(): Promise<Schema.SelectShareableLinks[]> {
    return db.query.shareableLinks.findMany({
      where: and(
        eq(Schema.shareableLinks.status, VO.ShareableLinkStatusEnum.active),
        lte(Schema.shareableLinks.expiresAt, Date.now()),
      ),
    });
  }
}
