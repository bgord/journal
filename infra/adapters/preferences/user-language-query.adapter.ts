import type * as bg from "@bgord/bun";
import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class UserLanguageQueryAdapterDrizzle implements bg.Preferences.Ports.UserLanguageQueryPort {
  async get(userId: Auth.VO.UserIdType) {
    const row = await db.query.userPreferences.findFirst({
      where: and(
        eq(Schema.userPreferences.userId, userId),
        eq(Schema.userPreferences.preference, "language"),
      ),
    });

    return row?.value ?? null;
  }
}

export function createUserLanguageQuery() {
  return new UserLanguageQueryAdapterDrizzle();
}
