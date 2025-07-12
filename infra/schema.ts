import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
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
    payload: text("payload").notNull(),
  },
  (table) => [index("stream_idx").on(table.stream)],
);

export const entries = sqliteTable("entries", {
  id,
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

export const alarms = sqliteTable("alarms", {
  id,
  generatedAt: integer("generatedAt").notNull(),
  entryId: text("entryId", { length: 36 }).references(() => entries.id),
  status: text("status", toEnumList(AlarmStatusEnum)).notNull(),
  name: text("name", toEnumList(AlarmNameOption)).notNull(),
  advice: text("advice"),
});

export type SelectEntries = typeof entries.$inferSelect;
export type SelectAlarms = typeof alarms.$inferSelect;
