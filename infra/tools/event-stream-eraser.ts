import * as bg from "@bgord/bun";
import { and, eq, ne, or, sql } from "drizzle-orm";
import * as Auth from "+auth";
import { db } from "+infra/db";
import type { EnvironmentResultType } from "+infra/env";
import * as Schema from "+infra/schema";

class EventStreamEraserDrizzleAdapter implements bg.EventStreamEraserPort {
  async erase(userId: Auth.VO.UserIdType): Promise<void> {
    await db
      .delete(Schema.events)
      .where(
        and(
          or(
            eq(sql`json_extract(${Schema.events.payload}, '$.userId')`, userId),
            eq(sql`json_extract(${Schema.events.payload}, '$.ownerId')`, userId),
          ),
          ne(Schema.events.name, Auth.Events.ACCOUNT_DELETED_EVENT),
        ),
      );
  }
}

export function createEventStreamEraser(Env: EnvironmentResultType): bg.EventStreamEraserPort {
  const EventStreamEraser = new EventStreamEraserDrizzleAdapter();

  return {
    [bg.NodeEnvironmentEnum.local]: EventStreamEraser,
    [bg.NodeEnvironmentEnum.test]: new bg.EventStreamEraserNoopAdapter(),
    [bg.NodeEnvironmentEnum.staging]: EventStreamEraser,
    [bg.NodeEnvironmentEnum.production]: EventStreamEraser,
  }[Env.type];
}
