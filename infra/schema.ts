import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

const id = text("id", { length: 36 })
  .primaryKey()
  .$defaultFn(() => randomUUID());

const createdAt = integer("createdAt").default(sql`now`).notNull();

export const events = sqliteTable(
  "events",
  {
    id,
    createdAt,
    name: text("name").notNull(),
    stream: text("stream").notNull(),
    version: integer("version").notNull(),
    payload: text("payload").notNull(),
  },
  (table) => [index("stream_idx").on(table.stream)],
);
