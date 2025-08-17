import type { UserDirectoryPort } from "+auth/ports";
import { db } from "+infra/db";

export class UserDirectoryDrizzle implements UserDirectoryPort {
  async listActiveUserIds() {
    const rows = await db.query.users.findMany({ columns: { id: true } });
    return rows.map((r) => r.id);
  }
}
