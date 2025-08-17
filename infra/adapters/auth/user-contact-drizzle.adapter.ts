import { eq } from "drizzle-orm";
import type { EmailContact, UserContactPort } from "+auth/ports";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class UserContactDrizzle implements UserContactPort {
  async getPrimary(userId: string): Promise<EmailContact | undefined> {
    const user = await db.query.users.findFirst({
      where: eq(Schema.users.id, userId),
      columns: { email: true },
    });

    if (!user?.email) return undefined;
    return { type: "email", address: user.email };
  }
}
