import type { UserDirectoryOHQ } from "+auth/open-host-queries";
import { db } from "+infra/db";

export class UserDirectoryDrizzle implements UserDirectoryOHQ {
  async listActiveUserIds() {
    const rows = await db.query.users.findMany({ columns: { id: true } });
    return rows.map((r) => r.id);
  }
}
