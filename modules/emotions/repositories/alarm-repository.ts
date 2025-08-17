import { and, desc, eq } from "drizzle-orm";
import * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class AlarmRepository {
  static async listForUser(userId: Auth.VO.UserIdType) {
    return db.query.alarms.findMany({
      where: and(eq(Schema.alarms.userId, userId)),
      orderBy: desc(Schema.alarms.generatedAt),
    });
  }
}
