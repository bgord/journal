import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = text("id", { length: 36 })
  .primaryKey()
  .$defaultFn(() => randomUUID());

// TODO: add index
export const events = sqliteTable("events", {
  id,
  createdAt: integer("createdAt").default(sql`now`),
  name: text("name").notNull(),
  stream: text("stream").notNull(),
  version: integer("version").notNull(),
  payload: text("payload").notNull(),
});
