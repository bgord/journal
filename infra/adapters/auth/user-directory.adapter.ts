import type * as Auth from "+auth";
import { db } from "+infra/db";

class UserDirectoryOHQDrizzle implements Auth.OHQ.UserDirectoryOHQ {
  async listActiveUserIds() {
    const rows = await db.query.users.findMany({ columns: { id: true } });
    return rows.map((r) => r.id);
  }
}

export const UserDirectoryOHQ = new UserDirectoryOHQDrizzle();
