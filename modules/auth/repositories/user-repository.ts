import * as VO from "+auth/value-objects";
import { db } from "+infra/db";

export class UserRepository {
  static async listIds(): Promise<VO.UserIdType[]> {
    const result = await db.query.users.findMany({
      columns: { id: true },
    });

    return result.map((user) => user.id);
  }
}
