import * as tools from "@bgord/tools";
import { eq } from "drizzle-orm";
import type * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class UserContactOHQDrizzle implements Auth.OHQ.UserContactOHQ {
  async getPrimary(userId: Auth.VO.UserIdType) {
    const user = await db.query.users.findFirst({
      where: eq(Schema.users.id, userId),
      columns: { email: true },
    });

    if (!user?.email) return undefined;
    return { type: "email", address: tools.Email.parse(user.email) } as const;
  }
}

export const UserContactOHQ = new UserContactOHQDrizzle();
