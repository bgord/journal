import { eq } from "drizzle-orm";
import * as VO from "+auth/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class UserRepository {
  static async getEmailFor(userId: VO.UserIdType) {
    return db.query.users.findFirst({
      where: eq(Schema.users.id, userId),
      columns: { email: true },
    });
  }

  static async listIds(): Promise<VO.UserIdType[]> {
    const result = await db.query.users.findMany({
      columns: { id: true },
    });

    return result.map((user) => user.id);
  }
}
