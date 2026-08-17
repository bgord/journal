import type * as Auth from "+auth";
import { db } from "+infra/db";

class UserDirectoryOHQDrizzle implements Auth.OHQ.UserDirectoryOHQ {
  async listActiveUserIds(): Promise<ReadonlyArray<Auth.VO.UserIdType>> {
    const users = await db.query.users.findMany({ columns: { id: true } });

    return users.map((user) => user.id);
  }
}

export const UserDirectoryOHQ = new UserDirectoryOHQDrizzle();
