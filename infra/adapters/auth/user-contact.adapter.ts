import { eq } from "drizzle-orm";
import type { UserContactOHQ } from "+auth/open-host-queries";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class UserContactDrizzle implements UserContactOHQ {
  async getPrimary(userId: string) {
    const user = await db.query.users.findFirst({
      where: eq(Schema.users.id, userId),
      columns: { email: true },
    });

    if (!user?.email) return undefined;
    return { type: "email", address: user.email } as const;
  }
}

export function createUserContact(): UserContactOHQ {
  return new UserContactDrizzle();
}
