import { randomUUID } from "node:crypto";
import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { AlarmNameOption } from "../modules/emotions/value-objects/alarm-name-option";
import { AlarmStatusEnum } from "../modules/emotions/value-objects/alarm-status";
import { EntryStatusEnum } from "../modules/emotions/value-objects/entry-status";
// Imported separately because of Drizzle error in bgord-scripts/drizzle-generate.sh
import { GenevaWheelEmotion } from "../modules/emotions/value-objects/geneva-wheel-emotion.enum";
import { GrossEmotionRegulationStrategy } from "../modules/emotions/value-objects/gross-emotion-regulation-strategy.enum";

const toEnumList = (value: Record<string, string>) => ({
  enum: Object.keys(value) as [string, ...string[]],
});

const id = text("id", { length: 36 })
  .primaryKey()
  .$defaultFn(() => randomUUID());

export const events = sqliteTable(
  "events",
  {
    id,
    correlationId: text("correlationId").notNull(),
    createdAt: integer("createdAt").default(sql`now`).notNull(),
    name: text("name").notNull(),
    stream: text("stream").notNull(),
    version: integer("version").notNull(),
    revision: integer("revision").notNull().default(0),
    payload: text("payload").notNull(),
  },
  (table) => [
    index("stream_idx").on(table.stream),
    // cspell:disable-next-line
    uniqueIndex("stream_revision_uidx").on(table.stream, table.revision),
  ],
);

export const entries = sqliteTable("entries", {
  id,
  revision: integer("revision").notNull().default(0),
  startedAt: integer("startedAt").notNull(),
  finishedAt: integer("finishedAt"),
  situationDescription: text("situationDescription"),
  situationLocation: text("situationLocation"),
  situationKind: text("situationKind", toEnumList(GenevaWheelEmotion)),
  emotionLabel: text("emotionLabel"),
  emotionIntensity: integer("emotionIntensity"),
  reactionDescription: text("reactionDescription"),
  reactionType: text("reactionType", toEnumList(GrossEmotionRegulationStrategy)),
  reactionEffectiveness: integer("reactionEffectiveness"),
  status: text("status", toEnumList(EntryStatusEnum)).notNull(),
});

export const entriesRelations = relations(entries, ({ many }) => ({ alarms: many(alarms) }));

export const alarms = sqliteTable("alarms", {
  id,
  generatedAt: integer("generatedAt").notNull(),
  entryId: text("entryId", { length: 36 }).references(() => entries.id),
  status: text("status", toEnumList(AlarmStatusEnum)).notNull(),
  name: text("name", toEnumList(AlarmNameOption)).notNull(),
  advice: text("advice"),
});

export const alarmsRelations = relations(alarms, ({ one }) => ({
  entry: one(entries, { fields: [alarms.entryId], references: [entries.id] }),
}));

export type SelectEntries = typeof entries.$inferSelect;
export type SelectEntriesFormatted = Omit<SelectEntries, "startedAt"> & { startedAt: string };
export type SelectAlarms = typeof alarms.$inferSelect;
