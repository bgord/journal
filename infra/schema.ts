import { sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("event", {
  id: text("id").primaryKey().default(sql`uuid()`), // or use a UUID function
  createdAt: text("createdAt").default(sql`CURRENT_TIMESTAMP`),
  name: text("name").notNull(),
  stream: text("stream").notNull(),
  version: integer("version").notNull(),
  payload: text("payload").notNull(),
});
