import { db } from "+infra/db";
import * as Schema from "+infra/schema";
import { eq } from "drizzle-orm";
import { UserIdType } from "../value-objects/user-id";

export class UserRepository {
  static async getEmailFor(userId: UserIdType) {
    return db.query.users.findFirst({
      where: eq(Schema.users.id, userId),
      columns: { email: true },
    });
  }
}
