import { randomUUID } from "node:crypto";
import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

import * as Emotions from "../modules/emotions";

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

export const emotionJournalEntries = sqliteTable("emotionJournalEntries", {
  id,
  startedAt: integer("startedAt").notNull(),
  finishedAt: integer("finishedAt"),
  situationDescription: text("situationDescription"),
  situationLocation: text("situationLocation"),
  situationKind: text("situationKind"),
  emotionLabel: text("emotionLabel"),
  emotionIntensity: integer("emotionIntensity"),
  reactionDescription: text("reactionDescription"),
  reactionType: text("reactionType", {
    enum: Object.keys(Emotions.VO.GrossEmotionRegulationStrategy) as [string, ...string[]],
  }),
  reaction: text("reaction"),
  status: text("status", {
    enum: Object.keys(Emotions.VO.EmotionJournalEntryStatusEnum) as [string, ...string[]],
  }).notNull(),
});
