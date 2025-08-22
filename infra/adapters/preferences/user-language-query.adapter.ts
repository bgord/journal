import { and, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import * as Preferences from "+preferences";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

class UserLanguageQueryAdapterDrizzle implements Preferences.Ports.UserLanguageQueryPort {
  async get(userId: Auth.VO.UserIdType) {
    const row = await db.query.userPreferences.findFirst({
      where: and(
        eq(Schema.userPreferences.userId, userId),
        eq(Schema.userPreferences.preference, "language"),
      ),
    });

    return row ? Preferences.VO.LanguageTag.create(row.value) : null;
  }
}

export const UserLanguageQueryAdapter = new UserLanguageQueryAdapterDrizzle();
