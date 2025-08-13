import { and, eq } from "drizzle-orm";
import * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import * as VO from "+publishing/value-objects";

export class CountActiveShareableLinksPerOwner {
  static async execute(ownerid: Auth.VO.UserIdType): Promise<{ count: number }> {
    return {
      count: await db.$count(
        Schema.shareableLinks,
        and(
          eq(Schema.shareableLinks.ownerId, ownerid),
          eq(Schema.shareableLinks.status, VO.ShareableLinkStatusEnum.active),
        ),
      ),
    };
  }
}
