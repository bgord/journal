import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { EmotionJournalEntryStatusEnum } from "../modules/emotions/value-objects/emotion-journal-entry-status";
import { GenevaWheelEmotion } from "../modules/emotions/value-objects/geneva-wheel-emotion.enum";
import { GrossEmotionRegulationStrategy } from "../modules/emotions/value-objects/gross-emotion-regulation-strategy.enum";

const id = text("id", { length: 36 })
  .primaryKey()
  .$defaultFn(() => randomUUID());

export const events = sqliteTable(
  "events",
  {
    id,
    createdAt: integer("createdAt").default(sql`now`).notNull(),
    name: text("name").notNull(),
    stream: text("stream").notNull(),
    version: integer("version").notNull(),
    payload: text("payload").notNull(),
  },
  (table) => [index("stream_idx").on(table.stream)],
);

const toEnumList = (value: Record<string, string>) => ({
  enum: Object.keys(value) as [string, ...string[]],
});

export const emotionJournalEntries = sqliteTable("emotionJournalEntries", {
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
  reaction: text("reaction"),
  status: text("status", toEnumList(EmotionJournalEntryStatusEnum)).notNull(),
});
