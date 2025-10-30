import * as bg from "@bgord/bun";
import { desc, eq } from "drizzle-orm";
import type hono from "hono";
import type * as infra from "+infra";
import { db } from "+infra/db";
import * as Schema from "+infra/schema";

export async function HistoryList(c: hono.Context<infra.HonoConfig>) {
  const subject = bg.History.VO.HistorySubject.parse(c.req.param("subject"));

  const result = await db
    .select()
    .from(Schema.history)
    .where(eq(Schema.history.subject, subject))
    .orderBy(desc(Schema.history.createdAt))
    .limit(15);

  return c.json(
    result.map((entry) => ({
      ...entry,
      payload: entry.payload ? JSON.parse(entry.payload as string) : {},
    })),
  );
}
