import { and, desc, eq } from "drizzle-orm";
import type * as Auth from "+auth";
import type * as Emotions from "+emotions";
import type * as VO from "+emotions/value-objects";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export class AlarmDirectoryDrizzle implements Emotions.Ports.AlarmDirectoryPort {
  async listForUser(userId: Auth.VO.UserIdType): Promise<ReadonlyArray<VO.AlarmSnapshot>> {
    return db.query.alarms.findMany({
      where: and(eq(Schema.alarms.userId, userId)),
      orderBy: desc(Schema.alarms.generatedAt),
    });
  }
}

export const AlarmDirectory = new AlarmDirectoryDrizzle();
